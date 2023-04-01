# Open Source, Self-Hosted Chat GPT APP

https://user-images.githubusercontent.com/19983429/223075269-7e22678c-b44b-41db-8337-48721f1f4207.mp4

[![Join our Discord server!](https://invidget.switchblade.xyz/RwFPjfTZdT)](http://discord.gg/RwFPjfTZdT)

## Stack

- Prisma,
- tRPC
- NextJS
- TypeScript
- Sqlite
- Mantine (React comoponent library)

## ⚙️ How to run

### 🧑🏽‍💻 Single User Mode
(It's an example, replace values with what makes sense in your current setup)
```
docker run -p 3000:3000 \
  -e DATABASE_URL=file:./db.sqlite \
  -e NEXTAUTH_SECRET=secret \
  -e NEXTAUTH_URL=http://localhost:3000/ \
  -e ADMIN_EMAIL=admin@admin.com \
  -e ADMIN_PASSWORD=password \
  bitswired/ai-chat-app:single-user-latest
```

### 🧑🏽‍💻🧑🏽‍💻 Multi User Mode
(It's an example, replace values with what makes sense in your current setup)
```
docker run \
-p 3000:3000 \
-e DATABASE_URL=file:./db.sqlite \
-e NEXTAUTH_SECRET=secret \
-e NEXTAUTH_URL=http://localhost:3000 \
-e ADMIN_EMAIL=youremail@address.com \
-e NEXT_PUBLIC_MULTI_USER=1 \
-e EMAIL_SERVER_HOST=smtp.gmail.com \
-e EMAIL_SERVER_PORT=465 \
-e EMAIL_SERVER_USER=user@gmail.com \
-e EMAIL_SERVER_PASSWORD=test \
-e EMAIL_FROM=ai-chat-app@ai-chat-app.com \
bitswired/ai-chat-app:multi-user-latest
```

### 🧑🏽‍💻🧑🏽‍💻 Multi User Mode UNRAID ONLY (Modified by barnito)
(It's an example, replace values with what makes sense in your current setup)
```
docker run
  -d
  --name='ai-chat-app'
  --net='bridge'
  -e TZ="America/New_York"
  -e HOST_OS="Unraid"
  -e HOST_HOSTNAME="UnraidServer"
  -e HOST_CONTAINERNAME="ai-chat-app"
  -e 'NEXTAUTH_SECRET'='XXXX'
  -e 'NEXTAUTH_URL'='XXXX'
  -e 'ADMIN_EMAIL'='XXXX'
  -e 'ADMIN_PASSWORD'='XXXX'
  -e 'EMAIL_SERVER_HOST'='smtp.gmail.com'
  -e 'EMAIL_SERVER_PORT'='465'
  -e 'EMAIL_SERVER_USER'='XXXX@gmail.com'
  -e 'EMAIL_SERVER_PASSWORD'='XXXX'
  -e 'EMAIL_FROM'='ai-chat-app@ai-chat-app.com'
  -e 'NEXT_PUBLIC_MULTI_USER'='1'
  -e 'DATABASE_URL'='file:/config/db.sqlite'
  -e 'PUID'='99'
  -e 'PGID'='100'
  -e 'UMASK'='022'
  -l net.unraid.docker.managed=dockerman
  -l net.unraid.docker.webui='http://[IP]:[PORT:3000]'
  -l net.unraid.docker.icon='https://github.com/bitswired/fuseai/raw/main/public/logo.png'
  -p '3000:3000/tcp'
  -v '/mnt/user/appdata/ai-chat-app':'/config':'rw' 'bitswired/ai-chat-app:multi-user-latest'
  ```

## 🚀 Roadmap

> Contribution welcomed!

1. Dockerize the app
2. Add ChatGPT prompt templates to speed up reusable worflows
3. Integrate vocal chat with the Whisper API
4. Make it more mobile friendly
5. Overall imporovement of the design


## Acknowledgments

I would like to express my gratitude to some early contributors who helped make this GitHub repository possible.

Firstly, a big thank you to [DennisTheD](https://github.com/DennisTheD) for his assistance in identifying and addressing bugs, as well as his help in delivering the initial version of the Docker image with support for database migrations.

Additionally, I would like to extend my appreciation to [barnito](https://github.com/barnito) for his outstanding efforts in integrating UNRAID, and for his generous and friendly support of the community on the Discord platform.
