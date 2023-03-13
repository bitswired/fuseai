import {
  Box,
  Button,
  Overlay,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  console.log(router.query);
  const handleSignIn = () => {
    signIn("email", { email, callbackUrl: "/" }).catch(console.error);
  };

  return (
    <>
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
          <Paper w="max-content" p={32}>
            <Stack>
              <Text size="2em" weight={500}>
                Welcome to the AI Chat App
              </Text>

              <Box h={200} sx={{ aspectRatio: "1", m: "auto" }} pos="relative">
                <Image
                  src="/logo.png"
                  alt="logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </Box>

              <Stack>
                <TextInput
                  required
                  type="email"
                  //   label="Email"
                  placeholder="hal@ai.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Stack>
              <Button type="submit" radius="md" onClick={() => handleSignIn()}>
                Sign In
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Overlay>
    </>
  );
}
