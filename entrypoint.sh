#!/bin/sh

# Copy config files if they don't exist
if [ ! -d "/config" ]; then
    ln -s /app /config
elif [ -z "$(ls -A /config)" ]; then
    cp -a /app/. /config/
fi
# Start application
yarn start