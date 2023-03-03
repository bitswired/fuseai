import { api } from "@/utils/api";
import {
  ActionIcon,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { IconFilter, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

interface ChatMenuProps {
  openEditName: (id: number) => void;
}
export function ChatMenu({ openEditName }: ChatMenuProps) {
  const { query } = useRouter();

  const [filterQuery, setFilterQuey] = useState<string>("");
  const utils = api.useContext();
  const chats = api.chat.getAllChats.useQuery();
  const createChat = api.chat.createChat.useMutation({
    onSuccess: (d) => {
      utils.invalidate().catch(console.error);
    },
  });
  const removeChat = api.chat.removeChat.useMutation({
    onSuccess: (d) => {
      utils.invalidate().catch(console.error);
    },
  });

  return (
    <Stack w="100%" justify="flex-start" p={32}>
      <Button onClick={() => createChat.mutate()}>Create New Chat</Button>

      <Stack spacing={16} my="2em">
        <TextInput
          value={filterQuery}
          onChange={(e) => setFilterQuey(e.target.value)}
          placeholder="Filter chats"
          icon={<IconFilter />}
        />
        {chats.data &&
          chats.data
            .filter((x) =>
              x.name.toLowerCase().includes(filterQuery.toLowerCase())
            )
            .map((chat) => (
              <Group
                key={chat.id}
                sx={{ border: "1px solid black", borderRadius: "10px" }}
                p={16}
              >
                <ActionIcon
                  size="sx"
                  onClick={() => removeChat.mutate({ id: chat.id })}
                >
                  <ThemeIcon color="red" variant="light">
                    <IconTrash size={12} />
                  </ThemeIcon>
                </ActionIcon>

                <Link href={`/chats/${chat.id}`} passHref>
                  <Text truncate sx={{ maxWidth: "10ch" }}>
                    {chat.name}
                  </Text>
                </Link>

                <Button
                  size="xs"
                  ml="auto"
                  onClick={() => openEditName(chat.id)}
                  variant="subtle"
                >
                  Rename
                </Button>
              </Group>
            ))}
      </Stack>
    </Stack>
  );
}
