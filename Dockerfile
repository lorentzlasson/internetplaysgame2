FROM node:18

WORKDIR /app

COPY common ./common

WORKDIR backend

COPY backend/package*.json ./

RUN npm ci

COPY backend/src ./src

# Terrible hack
RUN sed -i.back -e '23d' node_modules/ws/package.json

CMD npm start
