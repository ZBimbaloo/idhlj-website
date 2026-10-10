#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Convert Markdown files to styled PDF documents via ReportLab."""
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
    KeepTogether, Preformatted, HRFlowable
)


# --- Register a CJK-capable font (built into ReportLab) ---
pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))

BRAND_ORANGE = HexColor('#F57C00')
BRAND_ORANGE_LIGHT = HexColor('#FDF1E1')
GREY = HexColor('#6B7280')
DARK = HexColor('#1F2937')
RULE = HexColor('#F5A623')


def base_style():
    ss = getSampleStyleSheet()
    normal = ParagraphStyle(
        'CJKBody', parent=ss['Normal'],
        fontName='STSong-Light', fontSize=10.5, leading=15,
        textColor=DARK, spaceAfter=4, alignment=0,
    )
    return normal


def heading_style(level):
    sizes = {1: 22, 2: 16, 3: 13, 4: 11.5, 5: 11, 6: 10.5}
    return ParagraphStyle(
        f'H{level}', fontName='STSong-Light',
        fontSize=sizes.get(level, 10), leading=sizes.get(level, 10) + 6,
        textColor=BRAND_ORANGE if level <= 2 else DARK,
        spaceBefore=12 if level == 1 else 8,
        spaceAfter=6 if level == 1 else 4,
        fontStyle='Bold' if level <= 3 else 'Bold',
    )


def inline_to_html(text: str) -> str:
    """Convert inline markdown to ReportLab inline HTML tags."""
    # escape XML
    s = (text.replace('&', '&amp;')
             .replace('<', '&lt;')
             .replace('>', '&gt;'))

    # [text](url) -> <font color="#0563C1"><u>text</u></font>
    def link_repl(m):
        return (f'<font color="#0563C1"><u>{m.group(1)}</u></font>')
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link_repl, s)

    # `code` -> <font face="Courier" color="#C0392B">code</font>
    s = re.sub(r'`([^`]+)`',
               r'<font name="Courier" color="#C0392B">\1</font>', s)

    # **bold**
    s = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', s)
    # *italic*
    s = re.sub(r'\*([^*]+)\*', r'<i>\1</i>', s)
    return s


def parse_inline_table(lines, start):
    rows = []
    i = start
    n = len(lines)
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
    in_code = False
    code_buf = []

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
                    leading=11, leftIndent=8, rightIndent=8,
                    backColor=HexColor('#F4F4F4'),
                    borderColor=HexColor('#E5E7EB'),
                    borderWidth=0.5, borderPadding=6,
                    textColor=DARK,
                ))
                flow.append(pf)
                flow.append(Spacer(1, 4))
                in_code = False
                code_buf = []
            i += 1
            continue
        if in_code:
            code_buf.append(line)
            i += 1
            continue

        if not stripped:
            i += 1
            continue

        if re.match(r'^-{3,}$', stripped) or re.match(r'^\*{3,}$', stripped):
            flow.append(HRFlowable(width='100%', thickness=0.8,
                                   color=RULE, spaceBefore=4, spaceAfter=4))
            i += 1
            continue

        # heading
        m = re.match(r'^(#{1,6})\s+(.*)$', stripped)
        if m:
            level = len(m.group(1))
            txt = inline_to_html(m.group(2).strip())
            p = Paragraph(txt, heading_style(level))
            if level == 1:
                p.style = ParagraphStyle(
                    'H1', parent=heading_style(1),
                    borderPadding=(0, 0, 4, 0),
                )
                flow.append(KeepTogether([
                    p,
                    HRFlowable(width='100%', thickness=1.2,
                               color=BRAND_ORANGE, spaceBefore=0,
                               spaceAfter=6),
                ]))
            else:
                flow.append(p)
            i += 1
            continue

        # table
        if stripped.startswith('|'):
            rows, i = parse_inline_table(lines, i)
            if rows:
                # convert each cell to Paragraph so we can use inline HTML
                p_rows = []
                max_cols = max(len(r) for r in rows)
                for r in rows:
                    p_row = []
                    for c_idx in range(max_cols):
                        txt = r[c_idx] if c_idx < len(r) else ''
                        if not p_rows:  # header row
                            cell_style = ParagraphStyle(
                                'TH', fontName='STSong-Light',
                                fontSize=9.5, leading=12,
                                textColor=colors.white,
                                alignment=1,
                                fontStyle='Bold',
                            )
                        else:
                            cell_style = ParagraphStyle(
                                'TD', fontName='STSong-Light',
                                fontSize=9, leading=11.5,
                                textColor=DARK, alignment=0,
                            )
                        p_row.append(Paragraph(inline_to_html(txt), cell_style))
                    p_rows.append(p_row)

                # column widths: distribute across usable width (A4 ~ 17cm)
                usable_w = 17.0 * cm
                col_w = [usable_w / max_cols] * max_cols
                tbl = Table(p_rows, colWidths=col_w, repeatRows=1)
                ts = TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), BRAND_ORANGE),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('GRID', (0, 0), (-1, -1), 0.4, HexColor('#E5E7EB')),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 5),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
                    ('TOPPADDING', (0, 0), (-1, -1), 4),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ])
                # zebra rows
                for r_idx in range(1, len(p_rows)):
                    if r_idx % 2 == 0:
                        ts.add('BACKGROUND', (0, r_idx), (-1, r_idx),
                               BRAND_ORANGE_LIGHT)
                tbl.setStyle(ts)
                flow.append(tbl)
                flow.append(Spacer(1, 6))
            continue

        # blockquote
        if stripped.startswith('>'):
            txt = inline_to_html(stripped.lstrip('>').strip())
            qstyle = ParagraphStyle(
                'Quote', fontName='STSong-Light',
                fontSize=10.5, leading=15,
                textColor=GREY, leftIndent=14, rightIndent=8,
                borderColor=BRAND_ORANGE, borderWidth=0,
                borderPadding=(4, 8, 4, 12),
                backColor=BRAND_ORANGE_LIGHT,
            )
            # manual left border via a 1-cell table
            quote_tbl = Table([[Paragraph(txt, qstyle)]], colWidths=[17*cm])
            quote_tbl.setStyle(TableStyle([
                ('LINEBEFORE', (0, 0), (0, 0), 3, BRAND_ORANGE),
                ('BACKGROUND', (0, 0), (-1, -1), BRAND_ORANGE_LIGHT),
                ('LEFTPADDING', (0, 0), (-1, -1), 8),
                ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            flow.append(quote_tbl)
            flow.append(Spacer(1, 4))
            i += 1
            continue

        # ordered list
        m = re.match(r'^(\d+)\.\s+(.*)$', stripped)
        if m:
            p = Paragraph(f'{m.group(1)}. {inline_to_html(m.group(2))}',
                          body_style)
            p.style = ParagraphStyle(
                'OL', parent=body_style,
                leftIndent=18, bulletIndent=6, spaceAfter=2,
            )
            flow.append(p)
            i += 1
            continue

        # unordered list
        m = re.match(r'^[-*+]\s+(.*)$', stripped)
        if m:
            p = Paragraph(f'• {inline_to_html(m.group(1))}',
                          ParagraphStyle('UL', parent=body_style,
                                         leftIndent=18, spaceAfter=2))
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
    cover_style = ParagraphStyle(
        'Cover', fontName='STSong-Light',
        fontSize=10, textColor=BRAND_ORANGE,
        leading=14, spaceAfter=4, fontStyle='Bold',
    )
    title_style = ParagraphStyle(
        'Title', fontName='STSong-Light',
        fontSize=26, leading=32, textColor=BRAND_ORANGE,
        spaceBefore=6, spaceAfter=6, fontStyle='Bold',
    )
    sub_style = ParagraphStyle(
        'Sub', fontName='STSong-Light',
        fontSize=10, textColor=GREY, leading=14, spaceAfter=10,
    )

    doc = SimpleDocTemplate(
        str(pdf_path), pagesize=A4,
        leftMargin=2.2*cm, rightMargin=2.2*cm,
        topMargin=2.0*cm, bottomMargin=2.0*cm,
        title=title,
    )
    md_text = md_path.read_text(encoding='utf-8')

    story = []
    story.append(Paragraph('欢乐家印尼子公司官网 · 文档', cover_style))
    story.append(Paragraph(title, title_style))
    story.append(Paragraph(f'生成自：{md_path.name}', sub_style))
    story.append(HRFlowable(width='100%', thickness=1.0,
                            color=RULE, spaceBefore=2, spaceAfter=8))
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
