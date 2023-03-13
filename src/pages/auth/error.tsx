import { Alert, Box, Group, Overlay, Paper, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";

import { IconAlertCircle } from "@tabler/icons-react";
import Image from "next/image";

export default function ErrorPage() {
  const {
    query: { error },
  } = useRouter();

  let comp;

  if (error === "AccessDenied") {
    comp = (
      <Alert icon={<IconAlertCircle size="1rem" />} title="Bummer!" color="red">
        You are not authorized to login. Only the admin email, or the email
        authorized by the admin can login. Contact the admin to get access.
      </Alert>
    );
  }

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
                Error
              </Text>
            </Group>
            {comp}
          </Stack>
        </Paper>
      </Box>
    </Overlay>
  );
}
