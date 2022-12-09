FROM node:19-alpine as build
ARG APP_NAME

WORKDIR /build
COPY . ./

RUN yarn install --immutable --immutable-cache \
    && cd packages/$APP_NAME \
    && yarn build \
    && mkdir /app \
    && cp dist/index.js /app \
    && rm -rf /build

FROM node:19-alpine as run
COPY --from=build /app /app
WORKDIR /app
CMD [ "node", "index.js" ]
