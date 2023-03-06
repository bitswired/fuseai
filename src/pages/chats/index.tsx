import { api } from "@/utils/api";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ChatPage() {
  const router = useRouter();
  const utils = api.useContext();
  const chats = api.chat.getAllChats.useQuery();
  const removeChat = api.chat.removeChat.useMutation({
    onSuccess: (d) => {
      utils.invalidate().catch(console.error);
    },
  });
  const createChat = api.chat.createChat.useMutation({
    onSuccess: (chat) => {
      utils.invalidate().catch(console.error);
      router.push(`/chats/${chat.id}`).catch(console.error);
    },
  });

  return (
    <>
      <Title m="auto" w="max-content">
        Chats
      </Title>
      <Button leftIcon={<IconPlus />} onClick={() => createChat.mutate()}>
        Create New Chat
      </Button>
      <SimpleGrid cols={4} p={32}>
        {chats.data?.map((chat) => (
          <Card
            key={chat.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            pos="relative"
          >
            <Card.Section></Card.Section>

            <ActionIcon
              top={5}
              right={5}
              pos="absolute"
              onClick={() => removeChat.mutate({ id: chat.id })}
            >
              <ThemeIcon color="red" variant="light">
                <IconTrash size={12} />
              </ThemeIcon>
            </ActionIcon>

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
    </>
  );
}
