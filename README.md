# Open Source, Self-Hosted Chat GPT APP

https://user-images.githubusercontent.com/19983429/222851571-a7f56e46-30fb-4940-8463-7ee8092f14c9.mp4

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
