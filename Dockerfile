FROM node:18

WORKDIR /app

COPY common ./common

WORKDIR backend

COPY backend/package*.json ./

RUN npm ci

COPY backend/src ./src

CMD npm start
