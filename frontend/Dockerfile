FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ .

EXPOSE 5173
# https://www.reddit.com/r/reactjs/comments/xx5605/docker_and_react_vite_what_am_i_doing_wrong/
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]