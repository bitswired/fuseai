import { api } from "@/utils/api";
import {
  Affix,
  Box,
  Button,
  createStyles,
  Drawer,
  Grid,
  Group,
  LoadingOverlay,
  MediaQuery,
  TextInput,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { CurrentChat } from "./current-chat";
import { ChatForm } from "./form";
import { ChatMenu } from "./menu";

const useStylesDesktop = createStyles((theme) => ({
  container: {
    width: "100%",
    height: "calc(100vh - 70px)",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(4, 1fr)",
    gap: 16,
    padding: 32,
  },
  menu: {
    p: 32,
    gridRowStart: 1,
    gridRowEnd: "span 4",
    background: "rgba(0,0,0,0.05)",
  },
  chat: {
    padding: 32,
    overflow: "scroll",
    gridRowStart: 1,
    gridRowEnd: "span 3",
    gridColumnStart: 2,
    gridColumnEnd: "span 3",
    background: "rgba(0,0,0,0.1)",
  },
  form: {
    p: 32,
    gridRowStart: 4,
    gridRowEnd: "span 1",
    gridColunStart: 2,
    gridColumnEnd: "span 4",
  },
}));

const useStylesMobile = createStyles((theme) => ({
  container: {
    height: "calc(100vh - 70px)",
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(4, 1fr)",
  },
  // menu: {
  //   gridRowStart: 1,
  //   gridRowEnd: "span 4",
  // },
  chat: {
    p: 32,
    overflow: "scroll",
    gridRowStart: 1,
    gridRowEnd: "span 3",
    gridColumnStart: 1,
    gridColumnEnd: "span 4",
  },
  form: {
    p: 32,
    gridRowStart: 4,
    gridRowEnd: "span 1",
    gridColunStart: 1,
    gridColumnEnd: "span 4",
  },
}));

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

  const addToChat = api.chat.addToChat.useMutation({
    onSuccess: () => {
      utils.invalidate().catch(console.error);
    },
  });

  const currentChat = api.chat.getChatById.useQuery(
    {
      id: parseInt(query.id as string),
    },
    { enabled: !!query.id }
  );

  const { classes: classesDesktop } = useStylesDesktop();
  const { classes: classesMobile } = useStylesMobile();

  return (
    // <Box pos="relative" w="100vw" m="auto" sx={{ maxWidth: "1200px" }}>
    <>
      <Grid>
        <LoadingOverlay visible={addToChat.isLoading} />

        <Grid.Col
          span={9}
          pb={100}
          p={32}
          sx={(theme) => ({
            overflow: "scroll",
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.fn.darken(theme.colors.orange[0], 0.8)
                : theme.colors.orange[0],
            height: "calc(100vh - 70px)",
          })}
        >
          <CurrentChat />
        </Grid.Col>
        <Grid.Col span={3} sx={{ height: "100%", overflow: "hidden" }}>
          <ChatMenu
            openEditName={(id: number) => setEditState({ ...editState, id })}
          />
        </Grid.Col>
        <Affix position={{ bottom: 50, right: 200 }}>
          <ChatForm addToChat={addToChat.mutate} />
        </Affix>
      </Grid>

      {false && (
        <>
          <MediaQuery smallerThan="md" styles={{ display: "none" }}>
            <Box className={classesDesktop.container}>
              <Box className={classesDesktop.menu}>
                <ChatMenu
                  openEditName={(id: number) =>
                    setEditState({ ...editState, id })
                  }
                />
              </Box>
              <Box className={classesDesktop.chat}>
                <CurrentChat />
              </Box>
              <Box className={classesDesktop.form}>
                <ChatForm addToChat={addToChat.mutate} />
              </Box>
            </Box>
          </MediaQuery>

          <MediaQuery largerThan="md" styles={{ display: "none" }}>
            <Box className={classesMobile.container}>
              <Box className={classesMobile.chat}>
                <CurrentChat />
              </Box>
              <Box className={classesMobile.form}>
                <ChatForm addToChat={addToChat.mutate} />
              </Box>
            </Box>
          </MediaQuery>
        </>
      )}

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
