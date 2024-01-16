FROM node:18-alpine
WORKDIR /app

COPY package.json yarn.lock ./

# For running on Mac M1
RUN apk --update --no-cache --virtual build-dependencies add \
        python3 \
        make \
        g++

RUN yarn install
RUN yarn add serve

RUN apk del build-dependencies

COPY . .

RUN yarn run build