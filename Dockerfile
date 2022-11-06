FROM node:19-alpine as build
ARG APP_NAME

WORKDIR /base
COPY . ./

RUN rm -rf packages/bins-app

RUN yarn install \
    && cd packages/$APP_NAME \
    && yarn build \
    && rm -rf ../../.yarn/cache

WORKDIR /base/packages/$APP_NAME

ENTRYPOINT ["yarn", "start:prod"]