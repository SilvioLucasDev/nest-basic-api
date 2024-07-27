FROM node:20-alpine

WORKDIR /app

RUN npm install -g @nestjs/cli \
  && npm install -g typeorm

COPY . .

RUN npm install

RUN chmod +x ./node_modules/.bin/*

EXPOSE 3000

CMD ["npm", "run", "start:dev"]