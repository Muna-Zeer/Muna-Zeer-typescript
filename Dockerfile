FROM node:20.11.1

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install


EXPOSE 3000
CMD npm start