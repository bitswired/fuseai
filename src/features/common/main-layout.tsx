import {
  AppShell,
  Burger,
  Button,
  Header,
  List,
  Navbar,
  Stack,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { spotlight } from "@mantine/spotlight";
import { IconCircleDashed } from "@tabler/icons-react";
import Link from "next/link";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const theme = useMantineTheme();
  const [isMenuOpened, toggleMenuOpened] = useToggle();
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        (isMenuOpened && (
          <Navbar p="md" hidden={!isMenuOpened} width={{ sm: 200, lg: 300 }}>
            <Stack>
              <Button onClick={() => spotlight.open()}>Open Spotlight</Button>
              <List>
                <Link href="/chat" passHref>
                  <List.Item
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCircleDashed size="1rem" />
                      </ThemeIcon>
                    }
                  >
                    <Text>Chat</Text>
                  </List.Item>
                </Link>
              </List>
            </Stack>
          </Navbar>
        )) ||
        undefined
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <Burger
              opened={isMenuOpened}
              onClick={() => toggleMenuOpened()}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
            <Text>Chat App</Text>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
