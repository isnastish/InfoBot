# TODO: Figure out how to do a multi-stage build 
FROM node:23-alpine3.20 AS build-env

WORKDIR /usr/src/app

COPY . ./

RUN npm install

# Produce srouce javascript files in ./dist directory
RUN npm run build

EXPOSE 8080 

CMD [ "npm", "run", "start" ]