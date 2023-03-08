FROM node:lts-alpine as base
WORKDIR /app
EXPOSE 3000

FROM node:lts-alpine as build
WORKDIR /src
COPY . .
COPY ./.env.example ./.env
RUN yarn && yarn prisma migrate deploy && yarn build

FROM base as final
WORKDIR /app
COPY --from=build /src /app
ENTRYPOINT ["yarn", "start"]