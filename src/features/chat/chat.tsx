import { api } from "@/utils/api";
import {
  Button,
  Drawer,
  Group,
  List,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconCircleDashed,
  IconInfoCircle,
  IconRobot,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

function CurrentChat() {
  const { query } = useRouter();

  const utils = api.useContext();
  const addToChat = api.chat.addToChat.useMutation({
    onSuccess: () => {
      utils.invalidate().catch(console.error);
    },
  });

  const [text, setText] = useState("");

  const currentChat = api.chat.getChatById.useQuery(
    {
      id: parseInt(query.id as string),
    },
    { enabled: !!query.id }
  );

  const messages = currentChat.data?.messages ?? [];

  return (
    <Stack pos="relative" p={32} sx={{ borderLeft: "1px solid black" }}>
      <LoadingOverlay visible={addToChat.isLoading} />

      {currentChat.data && (
        <>
          <Title>{currentChat.data?.name}</Title>
          <Stack p={32} h="500px" sx={{ overflow: "scroll" }}>
            {messages.map((message) => (
              <Paper key={message.id} w="900px" p={16} shadow="sm">
                <Group align="flex-start">
                  {message.role === "system" && (
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconInfoCircle size="1rem" />
                    </ThemeIcon>
                  )}
                  {message.role === "user" && (
                    <ThemeIcon color="green" size={24} radius="xl">
                      <IconUser size="1rem" />
                    </ThemeIcon>
                  )}
                  {message.role === "assistant" && (
                    <ThemeIcon color="yellow" size={24} radius="xl">
                      <IconRobot size="1rem" />
                    </ThemeIcon>
                  )}

                  <Text
                    key={message.id}
                    sx={{
                      maxWidth: "90%",
                      overflow: "hidden",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {message.text}
                  </Text>
                </Group>
              </Paper>
            ))}
          </Stack>

          <Group mt="auto" mx="auto" w="100%">
            <Textarea
              w="80%"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              onClick={() =>
                addToChat.mutate({
                  id: parseInt(query.id as string),
                  message: text,
                })
              }
            >
              SUBMIT
            </Button>
          </Group>
        </>
      )}
    </Stack>
  );
}

export function Chat() {
  const { query } = useRouter();
  const [editState, setEditState] = useState({ id: -1, name: "" });

  const utils = api.useContext();
  const chats = api.chat.getAllChats.useQuery();
  const createChat = api.chat.createChat.useMutation({
    onSuccess: (d) => {
      utils.invalidate().catch(console.error);
    },
  });
  const renameChat = api.chat.renameChat.useMutation({
    onSuccess: (d) => {
      utils.invalidate().catch(console.error);
    },
  });

  const currentChat = api.chat.getChatById.useQuery(
    {
      id: parseInt(query.id as string),
    },
    { enabled: !!query.id }
  );

  return (
    <>
      <Group sx={{ height: "100%", overflow: "hidden" }} align="stretch">
        <Stack w="300px" justify="flex-start" p={32}>
          <Button onClick={() => createChat.mutate()}>Create New Chat</Button>

          <List spacing={16} my="2em">
            {chats.data &&
              chats.data.map((chat) => (
                <List.Item
                  key={chat.id}
                  icon={
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconCircleDashed size="1rem" />
                    </ThemeIcon>
                  }
                >
                  <Group>
                    <Link href={`/chat/${chat.id}`} passHref>
                      <Text>{chat.name}</Text>
                    </Link>
                    <Button
                      onClick={() =>
                        setEditState({ ...editState, id: chat.id })
                      }
                      variant="subtle"
                    >
                      Rename
                    </Button>
                  </Group>
                </List.Item>
              ))}
          </List>
        </Stack>

        <CurrentChat />
      </Group>
      <Drawer
        opened={editState.id !== -1}
        onClose={() => setEditState({ ...editState, id: -1 })}
        title="Authentication"
        position="right"
      >
        <Group>
          <TextInput
            value={editState.name}
            onChange={(e) =>
              setEditState({ ...editState, name: e.target.value })
            }
          />
          <Button
            onClick={() =>
              renameChat.mutate({
                id: editState.id,
                name: editState.name,
              })
            }
          >
            Rename
          </Button>
        </Group>
      </Drawer>
    </>
  );
}
