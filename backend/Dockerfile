FROM node:20.8.1

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . /app

EXPOSE 8080

CMD ["node","--trace-deprecation","server.js"]