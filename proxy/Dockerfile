FROM node:10

WORKDIR /proxy

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD npm start