# --- Build Angular ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# --- Nginx ---
FROM nginx:alpine
# Limpia el docroot y copia el build
RUN rm -rf /usr/share/nginx/html/*
# Si tu build tiene carpeta "browser", usa esa ruta:
# COPY --from=build /app/dist/demo/browser/ /usr/share/nginx/html/
# Si NO tiene "browser" y los archivos están directo en dist/demo/, usa esta:
COPY --from=build /app/dist/demo/browser/ /usr/share/nginx/html/

# SPA fallback + (opcional) header de versión
ARG APP_VERSION=v0.1.5
RUN printf "server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  add_header X-App-Version \"$APP_VERSION\" always;\n\
  location / { try_files \$uri /index.html; }\n\
}\n" > /etc/nginx/conf.d/default.conf
