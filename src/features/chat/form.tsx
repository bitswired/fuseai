import { type AppRouter } from "@/server/api/root";
import { api } from "@/utils/api";
import { Button, Group, Textarea } from "@mantine/core";
import { type inferRouterInputs } from "@trpc/server";
import { useRouter } from "next/router";
import { useState } from "react";

type RouterInput = inferRouterInputs<AppRouter>;
type AddToChatInput = RouterInput["chat"]["addToChat"];

interface ChatFormProps {
  addToChat: (input: AddToChatInput) => void;
}
export function ChatForm({ addToChat }: ChatFormProps) {
  const { query } = useRouter();

  const utils = api.useContext();
  const [text, setText] = useState("");

  const currentChat = api.chat.getChatById.useQuery(
    {
      id: parseInt(query.id as string),
    },
    { enabled: !!query.id }
  );

  if (!currentChat.data) return null;

  return (
    <Group
      w="60vw"
      p={16}
      sx={(theme) => ({
        backgroundColor: "rgba(0,0,0,0.1)",
        backdropFilter: "blur(5px)",
        borderRadius: "20px",
      })}
    >
      <Textarea
        ml="auto"
        placeholder="Prompt someting..."
        maxRows={7}
        autosize
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ flexGrow: 1 }}
      />
      <Button
        onClick={() =>
          addToChat({
            id: parseInt(query.id as string),
            message: text,
          })
        }
      >
        SUBMIT
      </Button>
    </Group>

    // </Group>
  );
}
