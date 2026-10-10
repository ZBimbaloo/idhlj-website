#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Convert Markdown files to PDF styled like a Markdown preview (GitHub-like)."""
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    KeepTogether, Preformatted, HRFlowable,
)

# Register a CJK-capable CID font built into ReportLab
pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))

# ---- GitHub-markdown inspired palette ----
GH_TEXT      = HexColor('#1F2328')   # body text
GH_HEADING   = HexColor('#1F2328')   # headings (slightly stronger feel via bold)
GH_MUTED     = HexColor('#59636E')   # secondary text
GH_LINK      = HexColor('#0969DA')   # link blue
GH_RULE      = HexColor('#D0D7DE')   # light divider
GH_CODE_BG   = HexColor('#F6F8FA')   # code/quote bg
GH_TABLE_BD  = HexColor('#D0D7DE')
GH_TABLE_HD  = HexColor('#F6F8FA')
GH_QUOTE_BD  = HexColor('#D0D7DE')


def base_style():
    return ParagraphStyle(
        'Body', fontName='STSong-Light',
        fontSize=10.5, leading=16, textColor=GH_TEXT,
        spaceBefore=0, spaceAfter=8, alignment=0,
    )


def heading_style(level):
    sizes = {1: 26, 2: 21, 3: 17, 4: 14, 5: 12, 6: 11}
    return ParagraphStyle(
        f'H{level}', fontName='STSong-Light',
        fontSize=sizes.get(level, 11),
        leading=sizes.get(level, 11) + 8,
        textColor=GH_HEADING,
        spaceBefore=18 if level <= 2 else 14,
        spaceAfter=8 if level <= 2 else 6,
        fontStyle='Bold',
        borderPadding=(0, 0, 0, 0),
    )


def inline_to_html(text: str) -> str:
    s = (text.replace('&', '&amp;')
             .replace('<', '&lt;')
             .replace('>', '&gt;'))

    # autolink: <http://...> and bare URLs — skip, GitHub only styles [..](..)
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)',
               r'<font color="#0969DA"><u>\1</u></font>', s)
    s = re.sub(r'`([^`]+)`',
               r'<font name="Courier" color="#1F2328">\1</font>', s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'\*([^*]+)\*', r'<i>\1</i>', s)
    return s


def parse_inline_table(lines, start):
    rows = []
    i, n = start, len(lines)
    while i < n and lines[i].lstrip().startswith('|'):
        raw = lines[i].strip()
        cells = [c.strip() for c in raw.strip('|').split('|')]
        if all(re.match(r'^:?-+:?$', c) for c in cells if c):
            i += 1
            continue
        rows.append(cells)
        i += 1
    return rows, i


def build_flowables(md_text: str, body_style):
    flow = []
    lines = md_text.splitlines()
    i, n = 0, len(lines)
    in_code, code_buf = False, []

    while i < n:
        line = lines[i]
        stripped = line.strip()

        # fenced code
        if stripped.startswith('```'):
            if not in_code:
                in_code = True
                code_buf = []
            else:
                code_text = '\n'.join(code_buf)
                pf = Preformatted(code_text, ParagraphStyle(
                    'Code', fontName='Courier', fontSize=8.5,
                    leading=11.5, leftIndent=8, rightIndent=8,
                    backColor=GH_CODE_BG,
                    borderColor=GH_TABLE_BD,
                    borderWidth=0.5, borderPadding=8,
                    textColor=GH_TEXT,
                ))
                flow.append(pf)
                flow.append(Spacer(1, 6))
                in_code, code_buf = False, []
            i += 1
            continue
        if in_code:
            code_buf.append(line)
            i += 1
            continue

        if not stripped:
            i += 1
            continue

        # horizontal rule
        if re.match(r'^-{3,}$', stripped) or re.match(r'^\*{3,}$', stripped):
            flow.append(HRFlowable(width='100%', thickness=0.6,
                                   color=GH_RULE, spaceBefore=6,
                                   spaceAfter=10))
            i += 1
            continue

        # heading
        m = re.match(r'^(#{1,6})\s+(.*)$', stripped)
        if m:
            level = len(m.group(1))
            txt = inline_to_html(m.group(2).strip())
            p = Paragraph(txt, heading_style(level))
            # H1 & H2 get a bottom border like GitHub
            if level <= 2:
                flow.append(KeepTogether([
                    p,
                    HRFlowable(width='100%', thickness=0.7,
                               color=GH_RULE, spaceBefore=2,
                               spaceAfter=10),
                ]))
            else:
                flow.append(p)
            i += 1
            continue

        # table
        if stripped.startswith('|'):
            rows, i = parse_inline_table(lines, i)
            if rows:
                max_cols = max(len(r) for r in rows)
                # auto column widths based on content length
                col_weights = []
                for c in range(max_cols):
                    lengths = [len(r[c]) if c < len(r) else 0 for r in rows]
                    col_weights.append(max(8, max(lengths)))
                total = sum(col_weights)
                usable_w = 17.0 * cm
                col_w = [usable_w * w / total for w in col_weights]

                p_rows = []
                for r_idx, r in enumerate(rows):
                    p_row = []
                    for c_idx in range(max_cols):
                        txt = r[c_idx] if c_idx < len(r) else ''
                        if r_idx == 0:
                            cs = ParagraphStyle('TH', fontName='STSong-Light',
                                                fontSize=9.5, leading=12,
                                                textColor=GH_TEXT,
                                                fontStyle='Bold',
                                                alignment=1)
                        else:
                            cs = ParagraphStyle('TD', fontName='STSong-Light',
                                                fontSize=9, leading=12,
                                                textColor=GH_TEXT,
                                                alignment=0)
                        p_row.append(Paragraph(inline_to_html(txt), cs))
                    p_rows.append(p_row)

                tbl = Table(p_rows, colWidths=col_w, repeatRows=1)
                ts = TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), GH_TABLE_HD),
                    ('LINEBELOW', (0, 0), (-1, 0), 0.7, GH_TABLE_BD),
                    ('LINEBELOW', (0, 1), (-1, -1), 0.3, HexColor('#E6E8EB')),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 8),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                    ('TOPPADDING', (0, 0), (-1, -1), 5),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
                ])
                tbl.setStyle(ts)
                flow.append(tbl)
                flow.append(Spacer(1, 10))
            continue

        # blockquote
        if stripped.startswith('>'):
            txt = inline_to_html(stripped.lstrip('>').strip())
            qs = ParagraphStyle('Quote', fontName='STSong-Light',
                                fontSize=10.5, leading=16,
                                textColor=GH_MUTED,
                                leftIndent=10, rightIndent=4)
            quote_tbl = Table([[Paragraph(txt, qs)]], colWidths=[17*cm])
            quote_tbl.setStyle(TableStyle([
                ('LINEBEFORE', (0, 0), (0, 0), 3, GH_QUOTE_BD),
                ('LEFTPADDING', (0, 0), (-1, -1), 12),
                ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 2),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ]))
            flow.append(quote_tbl)
            flow.append(Spacer(1, 8))
            i += 1
            continue

        # ordered list
        m = re.match(r'^(\d+)\.\s+(.*)$', stripped)
        if m:
            p = Paragraph(f'{m.group(1)}. {inline_to_html(m.group(2))}',
                          ParagraphStyle('OL', parent=body_style,
                                         leftIndent=22, spaceAfter=3,
                                         bulletIndent=10))
            flow.append(p)
            i += 1
            continue

        # unordered list
        m = re.match(r'^[-*+]\s+(.*)$', stripped)
        if m:
            p = Paragraph(f'• {inline_to_html(m.group(1))}',
                          ParagraphStyle('UL', parent=body_style,
                                         leftIndent=22, spaceAfter=3))
            flow.append(p)
            i += 1
            continue

        # paragraph (collect consecutive non-special lines)
        para_lines = [stripped]
        j = i + 1
        while j < n:
            nxt = lines[j].strip()
            if (not nxt or nxt.startswith('#') or nxt.startswith('|')
                    or nxt.startswith('>') or nxt.startswith('-')
                    or nxt.startswith('*') or re.match(r'^\d+\.', nxt)
                    or nxt.startswith('```')
                    or re.match(r'^-{3,}$', nxt)):
                break
            para_lines.append(nxt)
            j += 1
        text = inline_to_html(' '.join(para_lines))
        flow.append(Paragraph(text, body_style))
        i = j

    return flow


def convert_file(md_path: Path, pdf_path: Path, title: str):
    body_style = base_style()
    title_style = ParagraphStyle(
        'Title', fontName='STSong-Light',
        fontSize=24, leading=30, textColor=GH_HEADING,
        spaceBefore=4, spaceAfter=4, fontStyle='Bold',
    )
    sub_style = ParagraphStyle(
        'Sub', fontName='STSong-Light',
        fontSize=9.5, textColor=GH_MUTED, leading=14, spaceAfter=8,
    )

    doc = SimpleDocTemplate(
        str(pdf_path), pagesize=A4,
        leftMargin=2.2*cm, rightMargin=2.2*cm,
        topMargin=2.0*cm, bottomMargin=2.0*cm,
        title=title,
    )
    md_text = md_path.read_text(encoding='utf-8')

    story = []
    story.extend(build_flowables(md_text, body_style))

    doc.build(story)
    return pdf_path


if __name__ == '__main__':
    base = Path(r'd:\code\idhlj-website')
    targets = [
        (base / '印尼官网需求文档.md',
         base / '印尼官网需求文档.pdf',
         '欢乐家印尼子公司官网 · 需求文档'),
        (base / '素材缺失文档.md',
         base / '素材缺失文档.pdf',
         '欢乐家印尼子公司官网 · 缺失素材汇总'),
    ]
    for src, dst, title in targets:
        if not src.exists():
            print(f'[skip] {src} not found')
            continue
        out = convert_file(src, dst, title)
        print(f'[ok]   {out}  ({out.stat().st_size:,} bytes)')
