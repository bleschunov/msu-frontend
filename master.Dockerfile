FROM node:16-alpine
WORKDIR /app

COPY . .

RUN yarn add serve
RUN yarn install
RUN yarn run build

ENV NODE_ENV production
ENV REACT_APP_BACKEND_URI 'https://msu-backend-master.fly.dev'
EXPOSE 3000

CMD [ "npx", "serve", "build" ]