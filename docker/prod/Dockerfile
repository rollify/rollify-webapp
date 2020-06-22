FROM node:14 as build
WORKDIR /app
COPY ./ ./
RUN yarn global add @quasar/cli
RUN yarn
RUN cp ./config/index.js.prod ./config/index.js
RUN quasar build

# production stage
FROM nginx:alpine
COPY --from=build /app/dist/spa /usr/share/nginx/html
EXPOSE 80
COPY  docker/prod/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]