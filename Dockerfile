FROM node:19-alpine as build
ARG APP_NAME

WORKDIR /base
COPY . ./
RUN yarn install --immutable
RUN cd packages/$APP_NAME && yarn build

ENTRYPOINT ['yarn', 'start']