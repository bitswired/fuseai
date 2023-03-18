import { ApiKey } from "@/features/settings";
import { AccountsSettings } from "@/features/settings/accounts";
import { Stack, Tabs, Title } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";

export default function Settings() {
  return (
    <>
      <Stack m="auto" align="center" justify="stretch" p={32}>
        <Title m="auto">Settings</Title>
        <Tabs defaultValue="api" w="100%">
          <Tabs.List>
            <Tabs.Tab value="api" icon={<IconPhoto size="0.8rem" />}>
              API Keys
            </Tabs.Tab>
            <Tabs.Tab value="accounts" icon={<IconPhoto size="0.8rem" />}>
              Accounts
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="api" pt={64}>
            <ApiKey />
          </Tabs.Panel>

          <Tabs.Panel value="accounts" pt={64}>
            <AccountsSettings />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </>
  );
}
