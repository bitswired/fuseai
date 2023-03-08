
# Uses alpine as base
FROM alpine:3.15

ENV LANG="C.UTF-8" \
    PS1="$(whoami)@$(hostname):$(pwd)$ " \
    TERM="xterm-256color"

# Copy base directory to /app folder
COPY . /app
# Copy entrypoint script to /run folder
COPY entrypoint.sh /run/
# Set /app as working directory
WORKDIR /app

# Download yarn
RUN apk add yarn --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/

# Set permissions and create .env file (permissions may not need to be set)
RUN chmod 777 /app && \
    mv /app/.env.example /app/.env && \
    chmod 777 /run && \
    chmod +x /run/entrypoint.sh

# Install dependencies and build
RUN yarn install && \
    yarn prisma migrate deploy && \
    yarn build

# Create config folder and set permissions (to allow for bind mounts)
RUN \
    mkdir -p /config && \
    chmod 777 /config

# Create /app and /config volumes for persistence
VOLUME /app
VOLUME /config

# Expose port 3000
EXPOSE 3000

# Run entrypoint script
ENTRYPOINT ["/run/entrypoint.sh"]