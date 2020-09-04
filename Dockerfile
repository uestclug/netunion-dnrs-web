FROM node:latest as builder

COPY ./ /source

WORKDIR /source

RUN npm install && npm run build

FROM nginx:latest

COPY --from=builder /source/dist /app
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
