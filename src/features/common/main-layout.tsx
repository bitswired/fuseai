import {
  ActionIcon,
  Button,
  createStyles,
  Grid,
  Group,
  Stack,
  Text,
  ThemeIcon,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import {
  IconBrain,
  IconMessageCircle,
  IconMoonStars,
  IconSettings,
  IconSun,
  IconTemplate,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  path: string;
}
function MenuItem({ icon, text, path }: MenuItemProps) {
  const { pathname } = useRouter();

  console.log(path, pathname);

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
    <Grid>
      <Grid.Col className={classes.header} span={12}>
        <Group>
          <Group pl={32} align="center" w="max-content" h="100%">
            <ThemeIcon
              variant="gradient"
              gradient={{ from: "orange", to: "cyan" }}
            >
              <IconBrain size={64} />
            </ThemeIcon>
            <Text color="orange" weight="bold" size="2em">
              AI Chat
            </Text>
          </Group>

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
      </Grid.Col>
      <Grid.Col className={classes.menu} span={2}>
        <Menu />
      </Grid.Col>
      <Grid.Col className={classes.main} span={10}>
        <main id="main">{children}</main>
      </Grid.Col>
    </Grid>
  );
}
