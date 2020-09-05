FROM node:latest

COPY ./ /app

RUN yarn install

WORKDIR /app

ENTRYPOINT [ "yarn", "serve" ]
