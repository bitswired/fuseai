FROM alpine:latest

# Install nodejs and npm
RUN apk add --update nodejs npm

# Install yarn
RUN npm install -g yarn

# Copy all files
COPY . .

# Install dependencies
RUN yarn && yarn prisma migrate deploy && yarn build

# Copy the example environment variables
COPY .env.example .env

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["yarn", "start"]
