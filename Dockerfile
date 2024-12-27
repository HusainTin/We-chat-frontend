# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /app

COPY . .

RUN npm i


# ENV NODE_ENV development

EXPOSE 3000

RUN npm run build

CMD ["npm", "run","dev"]
# CMD ["npm", "run","start"] # CMD for production