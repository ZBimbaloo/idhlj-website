# Huanlejia Indonesia Website

印尼子公司官网 — Next.js 14 (App Router) + TypeScript + Tailwind CSS + next-intl。

- 域名：`https://id.gdhlj.com/`
- 双语：英文（默认） / 印尼语
- 响应式：PC / 平板 / 手机三端
- 风格：参考 nico.co.id，简洁、产品驱动、留白充足

## 目录结构

```
website/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx        # 双语布局
│   │   │   ├── page.tsx          # 首页
│   │   │   ├── about/page.tsx    # 公司简介
│   │   │   ├── group/page.tsx    # 集团与全球子公司
│   │   │   ├── factory/page.tsx  # 工厂与产线
│   │   │   ├── products/page.tsx # 产品中心
│   │   │   ├── quality/page.tsx  # 品质与认证
│   │   │   ├── sales/page.tsx    # 销售网
│   │   │   └── contact/page.tsx  # 联系我们
│   │   ├── layout.tsx            # 根 layout
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── globals.css
│   ├── components/               # 公共组件
│   ├── i18n/                     # i18n 配置
│   └── messages/                 # 翻译文件
│       ├── en.json
│       └── id.json
├── public/                       # 静态资源
├── package.json
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## 本地开发

```bash
cd website
npm install
npm run dev
```

访问：http://localhost:3000

## 生产构建

```bash
npm run build
npm run start
```

## 部署到 id.gdhlj.com

### 方式 A：Vercel（推荐）

1. 将 `website/` 推送到 GitHub 仓库
2. 在 Vercel 导入项目
3. 设置域名 `id.gdhlj.com` 并配置 DNS CNAME 指向 Vercel
4. 自动启用 HTTPS

### 方式 B：自有服务器（Nginx + Node.js）

1. `npm run build` 生成 `.next/` 目录
2. 用 PM2 启动 `npm run start`
3. Nginx 反向代理：

```nginx
server {
  server_name id.gdhlj.com;
  listen 443 ssl http2;
  ssl_certificate     /path/to/fullchain.pem;
  ssl_certificate_key /path/to/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## 占位素材替换

当前所有图片由 AI 占位（trae-api-cn.mchost.guru）生成，正式上线前需要替换为真实素材：

| 文件 / 区域 | 内容 |
| --- | --- |
| `src/messages/{en,id}.json` 中所有 `image` 字段 | 产品图、工厂图、集团总部图等 |
| `public/` 下放公司 Logo、产品 PDF、证书 PDF、视频 |
| Hero / Factory / Quality 等模块的封面与视频 |

## 翻译维护

- `src/messages/en.json` — 英文
- `src/messages/id.json` — 印尼语

每次新增文案键，必须同时在两份文件中添加。

## 询盘表单

当前版本提交后只显示成功 Toast，不发邮件。  
真实环境建议接入 SendGrid / Mailgun / SMTP / WhatsApp Business API。

## License

Private - © Huanlejia Group.