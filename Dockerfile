FROM node:lts-alpine as base
WORKDIR /app
ENV DATABASE_URL=file:/data/db.sqlite
EXPOSE 3000

FROM base as build
WORKDIR /src
COPY . .
RUN yarn
RUN yarn build \
  && npm prune --omit=dev --omit=optional \
  && npm cache clean --force

FROM base as single-user
WORKDIR /app
COPY --from=build /src /app
COPY startup.sh .
RUN chmod +x startup.sh
ENTRYPOINT ["/app/startup.sh"]

FROM base as multi-user
ENV NEXT_PUBLIC_MULTI_USER=1
WORKDIR /app
COPY --from=build /src /app
COPY startup.sh .
RUN chmod +x startup.sh
ENTRYPOINT ["/app/startup.sh"]