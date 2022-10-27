FROM node:19-alpine as build
ARG APP_NAME

WORKDIR /base
COPY . ./
RUN yarn install --frozen-lockfile
RUN cd packages/$APP_NAME && yarn build

ENTRYPOINT ['yarn', 'start']