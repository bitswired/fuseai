import { api } from "@/utils/api";
import {
  Box,
  Code,
  Group,
  Paper,
  Stack,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Prism, type PrismProps } from "@mantine/prism";
import { IconInfoCircle, IconRobot, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function CurrentChat({}) {
  const { query } = useRouter();

  const utils = api.useContext();
  const addToChat = api.chat.addToChat.useMutation({
    onSuccess: () => {
      utils.invalidate().catch(console.error);
    },
  });

  const prevCountRef = useRef();

  const [text, setText] = useState("");

  const currentChat = api.chat.getChatById.useQuery(
    {
      id: parseInt(query.id as string),
    },
    { enabled: !!query.id }
  );

  const messages = currentChat.data?.messages ?? [];

  useEffect(() => {
    const el = document.querySelector(".chat-messages:last-child");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!currentChat.data) return null;

  return (
    <>
      <Title>{currentChat.data?.name}</Title>
      <Stack p={32}>
        {messages.map((message) => (
          <Paper
            className="chat-messages"
            key={message.id}
            w="100%"
            p={16}
            shadow="sm"
            m="auto"
          >
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
              <Box w="90%">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({ children, inline, className }) => {
                      if (inline) {
                        return <Code>{children}</Code>;
                      }
                      const language = className?.split(
                        "-"
                      )[1] as PrismProps["language"];

                      return (
                        <Prism language={language}>
                          {children[0] as string}
                        </Prism>
                      );
                    },
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </Box>
            </Group>
          </Paper>
        ))}
      </Stack>
    </>
  );
}
