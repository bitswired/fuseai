import { api } from "@/utils/api";
import { Box, Button, Card, Group, SimpleGrid, Text } from "@mantine/core";
import Link from "next/link";

export default function ChatPage() {
  const chats = api.chat.getAllChats.useQuery();

  return (
    <SimpleGrid cols={4} p={32}>
      {chats.data?.map((chat) => (
        <Card key={chat.id} shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section></Card.Section>

          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>{chat.name}</Text>
            {/* <Badge color="pink" variant="light">
              On Sale
            </Badge> */}
          </Group>

          <Box h="7em">
            <Text size="sm" color="dimmed" lineClamp={4}>
              {chat.messages.map((message) => message.text).join("")}
            </Text>
          </Box>

          <Link href={`/chats/${chat.id}`}>
            <Button variant="light" color="orange" fullWidth radius="md">
              Chat
            </Button>
          </Link>
        </Card>
      ))}
    </SimpleGrid>
  );
}
