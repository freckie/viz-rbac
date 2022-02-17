# builder
FROM node:14-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install && npm run build

###

FROM nginx

EXPOSE 80

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
