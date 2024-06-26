FROM node:20.11.1

WORKDIR /usr/src/server
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .


EXPOSE 3000
CMD npm start