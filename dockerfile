ext
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist/mvp-sistema-presupuesto-anual /usr/share/nginx/html
EXPOSE 80