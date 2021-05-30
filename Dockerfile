FROM node as build

WORKDIR /app
COPY package*.json /app/
RUN npm install --include=dev

COPY jest.config.js /app/
COPY src /app/src
COPY test /app/test

RUN npm run test

FROM node as app

WORKDIR /app
COPY package*.json /app/
RUN npm install

COPY src /app/src

CMD npm start
