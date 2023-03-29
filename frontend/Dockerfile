FROM node

WORKDIR /app

COPY reactapp/package*.json ./

RUN npm install

COPY ./reactapp .

EXPOSE 3000

CMD ["npm", "start"]