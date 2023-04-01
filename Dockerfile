# build environment
FROM node:19.5.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./

ARG PAGE_TITLE
ARG VITE_STAGE
ARG VITE_TAG

ENV PAGE_TITLE=$PAGE_TITLE
ENV VITE_STAGE=$VITE_STAGE
ENV VITE_TAG=$VITE_TAG

RUN npm run build

# production environment
FROM nginx:stable-alpine

# rewrite default nginx conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]