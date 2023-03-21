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

## 🚀 Roadmap

> Contribution welcomed!

1. Dockerize the app
2. Add ChatGPT prompt templates to speed up reusable worflows
3. Integrate vocal chat with the Whisper API
4. Make it more mobile friendly
5. Overall imporovement of the design
