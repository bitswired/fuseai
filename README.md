# Open Source, Self-Hosted Chat GPT APP

https://user-images.githubusercontent.com/19983429/222471399-4f08bc58-6a3b-4769-8c6f-e981a58e5563.mp4


## Stack

- Prisma,
- tRPC
- NextJS
- TypeScript
- Sqlite

## How to run

1. Clone the repository
2. Create a `.env` file containing 2 entries:

```
DATABASE_URL="file:./db.sqlite"
OPENAI_API_KEY=<YOUR OPENAI API KEY>
```

2. Run `yarn`
3. Run `yarn prisma migrate deploy`
4. Run `yarn build`
5. Run `yarn start`
6. Visi localhost:3000

## Roadmap 🚀

> Contribution welcomed!

1. Dockerize the app
2. Add ChatGPT prompt templates to speed up reusable worflows
3. Integrate vocal chat with the Whisper API
4. Make it more mobile friendly
5. Overall imporovement of the design
