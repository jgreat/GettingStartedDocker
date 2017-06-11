FROM node:8.1.0-alpine

RUN apk add --no-cache bash

WORKDIR /app

RUN npm install -g nodemon

COPY package.json /app/package.json
RUN npm install && \
    mv /app/node_modules /node_modules

COPY . /app

CMD ["npm", "start"]
