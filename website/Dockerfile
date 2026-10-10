# 多阶段构建：第一阶段只需静态文件
FROM nginx:1.27-alpine AS runtime

# 删除默认站点
RUN rm -rf /usr/share/nginx/html/*

# 将本地构建好的静态文件复制进容器
COPY out/ /usr/share/nginx/html/

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
