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


## How to run

1. Clone the repository
2. Create a `.env` file containing 2 entries:

```
DATABASE_URL="file:./db.sqlite"
```

2. Run `yarn`
3. Run `yarn prisma migrate deploy`
4. Run `yarn build`
5. Run `yarn start`
6. Visit localhost:3000/settings
7. Add your OpenAI API Key
8. Enjoy your self-hosted ChatGPT

## Roadmap 🚀

> Contribution welcomed!

1. Dockerize the app
2. Add ChatGPT prompt templates to speed up reusable worflows
3. Integrate vocal chat with the Whisper API
4. Make it more mobile friendly
5. Overall imporovement of the design
