# syntax=docker/dockerfile:1
FROM node:21
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD npm run dev