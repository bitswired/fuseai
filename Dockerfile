FROM node:lts-alpine

# Copy all files but ignore the ones in .dockerignore
COPY . .

# Rename .env.example to .env
RUN mv .env.example .env

# Install dependencies
RUN yarn && yarn prisma migrate deploy && yarn build

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["yarn", "start"]