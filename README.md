https://archive.mirrorsedgearchive.org/

# BAOBAOJS Frontend

这是一个使用 Vite 构建的 React 单页应用。页面路由仍由 `react-router` 在浏览器端处理，但开发与生产构建均直接使用 Vite。

## Features

- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔒 TypeScript by default

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

应用默认运行在 `http://localhost:5173`。

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker 部署

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### 静态部署

部署 `npm run build` 生成的 `dist/` 目录，并将所有未知路径回退到 `index.html`，以支持浏览器端路由。

```
dist/
├── assets/
└── index.html
```

## Styling

项目已配置 Tailwind CSS，可按需使用。
