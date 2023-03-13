import {
  ActionIcon,
  Box,
  Button,
  createStyles,
  Grid,
  Group,
  NavLink,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconMessageCircle,
  IconMoonStars,
  IconSettings,
  IconSun,
  IconTemplate,
} from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  path: string;
}
function MenuItem(props: MenuItemProps) {
  const { pathname } = useRouter();

  const active = pathname.startsWith(props.path);

  return (
    <Link href={props.path}>
      {/* <Button
        leftIcon={icon}
        variant="subtle"
        color={pathname.startsWith(path) ? "cyan" : "primary"}
      > */}
      <NavLink
        active={active}
        label={props.label}
        description={props.description}
        sx={(theme) => ({ color: theme.colors.cyan[6] })}
        // rightSection={props.rightSection}
        icon={props.icon}
      />
    </Link>
  );
}

function Menu() {
  const { data } = useSession();
  return (
    <Stack spacing="xs" align="stretch" h="100%">
      {data?.user?.role === "admin" && (
        <MenuItem
          path="/settings"
          label="Settings"
          description="Configure the app"
          icon={<IconSettings />}
        />
      )}
      <MenuItem
        path="/chats"
        label="Chats"
        description="Start chatting"
        icon={<IconMessageCircle />}
      />
      <MenuItem
        path="/templates"
        label="Templates"
        description="Powerful templates"
        icon={<IconTemplate />}
      />

      <Stack mt="auto" sx={{ flex: "flex-end" }}>
        <Link href="https://discord.gg/RwFPjfTZdT" target="_blank">
          <Group>
            <ActionIcon>
              <ThemeIcon variant="filled" color="violet">
                <IconBrandDiscord />
              </ThemeIcon>
            </ActionIcon>
            <Text> Join Discord </Text>
          </Group>
        </Link>

        <Link href="https://github.com/bitswired/ai-chat-app" target="_blank">
          <Group>
            <ActionIcon>
              <ThemeIcon variant="filled" color="orange">
                <IconBrandGithub />
              </ThemeIcon>
            </ActionIcon>
            <Text> Join on GitHub </Text>
          </Group>
        </Link>
      </Stack>
    </Stack>
  );
}

const useStyles = createStyles((theme) => ({
  header: {
    height: "70px",
    borderBottom: "1px solid #eaeaea",
    // backgroundColor: "red",
  },
  menu: {
    height: "calc(100vh - 70px)",
    padding: "32px",
    borderRight: "1px solid #eaeaea",
    // backgroundColor: "blue",
  },
  main: {
    height: "calc(100vh - 70px)",
    // backgroundColor: "green",
  },
}));

export function MainLayout({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const { classes } = useStyles();

  const { data: sessionData } = useSession();

  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
    },
  });

  const handleSignOut = () => {
    signOut().catch((err) => console.log(err));
  };

  return (
    <>
      <Paper
        h="70px"
        pos="fixed"
        top={0}
        left={0}
        w="100%"
        shadow="xs"
        sx={{ zIndex: 100 }}
      >
        <Group w="100%" h="100%">
          <Link href="/">
            <Group pl={32} align="center" w="max-content">
              <Box h={50} sx={{ aspectRatio: "1" }} pos="relative">
                <Image
                  src="/logo.png"
                  alt="logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </Box>

              <Text color="orange" weight="bold" size="2em">
                AI Chat
              </Text>
            </Group>
          </Link>

          <Group ml="auto">
            <Text>{data?.user?.email}</Text>

            {sessionData?.user && (
              <Button
                size="xs"
                variant="outline"
                onClick={() => handleSignOut()}
              >
                Sign Out
              </Button>
            )}

            <ActionIcon
              variant="filled"
              mr={64}
              color={dark ? "orange" : "orange"}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? (
                <IconSun size="1.1rem" />
              ) : (
                <IconMoonStars size="1.1rem" />
              )}
            </ActionIcon>
          </Group>
        </Group>
      </Paper>

      <Grid mt="70px">
        <Grid.Col className={classes.menu} span={2}>
          <Menu />
        </Grid.Col>
        <Grid.Col className={classes.main} span={10}>
          <main id="main">{children}</main>
        </Grid.Col>
      </Grid>
    </>
  );
}
