FROM node:18-alpine
WORKDIR /app

COPY package.json package.json

RUN yarn add serve
RUN yarn install

COPY . .

RUN yarn run build

ENV NODE_ENV production
EXPOSE 3000

CMD [ "npx", "serve", "build" ]