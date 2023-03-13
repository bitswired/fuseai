import { Alert, Box, Group, Overlay, Paper, Stack, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

import Image from "next/image";

export default function VerifyPage() {
  return (
    <Overlay fixed blur={10}>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper w="max-content" p={32} sx={{ maxWidth: "500px" }}>
          <Stack spacing={32}>
            <Group spacing={64}>
              <Box h={100} sx={{ aspectRatio: "1", m: "auto" }} pos="relative">
                <Image
                  src="/logo.png"
                  alt="logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </Box>
              <Text size="3em" weight="bold">
                Verify
              </Text>
            </Group>
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="You Succesfully Signed In!"
              color="green"
            >
              The app use passwordless authentication. You should have received
              an email with a link to sign in. See you in a bit 🚀.
            </Alert>
          </Stack>
        </Paper>
      </Box>
    </Overlay>
  );
}
