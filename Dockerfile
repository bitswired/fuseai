FROM node:lts-alpine as base
WORKDIR /app
EXPOSE 3000

FROM node:lts-alpine as build
WORKDIR /src
COPY . .
COPY ./.env.example ./.env
RUN yarn 
RUN yarn prisma migrate deploy \
  && yarn build \
  && npm prune --omit=dev --omit=optional \
  && npm cache clean --force

FROM base as final
WORKDIR /app
COPY --from=build /src /app
ENTRYPOINT ["yarn", "start"]