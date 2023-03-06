import {
  ActionIcon,
  Box,
  Button,
  createStyles,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import {
  IconMessageCircle,
  IconMoonStars,
  IconSettings,
  IconSun,
  IconTemplate,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  path: string;
}
function MenuItem({ icon, text, path }: MenuItemProps) {
  const { pathname } = useRouter();

  return (
    <Link href={path}>
      <Button
        leftIcon={icon}
        variant="subtle"
        color={pathname.startsWith(path) ? "cyan" : "primary"}
      >
        {text}
      </Button>
    </Link>
  );
}

function Menu() {
  return (
    <Stack spacing="xs" align="stretch">
      <MenuItem path="/settings" text="Settings" icon={<IconSettings />} />
      <MenuItem path="/chats" text="Chats" icon={<IconMessageCircle />} />
      <MenuItem path="/templates" text="Templates" icon={<IconTemplate />} />
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
  const theme = useMantineTheme();
  const [isMenuOpened, toggleMenuOpened] = useToggle();

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const { classes } = useStyles();
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

          <ActionIcon
            variant="filled"
            ml="auto"
            mr={64}
            color={dark ? "orange" : "orange"}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
          >
            {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
          </ActionIcon>
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
