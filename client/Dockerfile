FROM node:alpine as build 

WORKDIR /app 

COPY . /app/

RUN yarn global add react-scripts@3.0.1 -g
RUN yarn install
RUN yarn run build

FROM nginx:latest

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]