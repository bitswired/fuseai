import { api } from "@/utils/api";
import {
  Box,
  Button,
  LoadingOverlay,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export default function Settings() {
  const settings = api.settings.getSettings.useQuery();
  const upsertSettings = api.settings.upsertSettings.useMutation();

  const form = useForm({
    initialValues: {
      openaiKey: "",
    },
  });

  const onSubmit = useEffect(() => {
    if (settings.data) {
      const x = settings.data;
      form.setValues({ openaiKey: settings.data.openaiKey || "" });
    } else {
    }
  }, [settings.data]);

  return (
    <>
      <Title>Settings</Title>

      <Box
        component="form"
        pos="relative"
        onSubmit={form.onSubmit((v) =>
          upsertSettings.mutate({
            id: settings.data?.id,
            openaiKey: v.openaiKey,
          })
        )}
      >
        <LoadingOverlay visible={settings.isFetching} />
        <Stack m="auto" sx={{ maxWidth: "500px" }}>
          <TextInput
            required
            withAsterisk
            type="password"
            label="OpenAI Api Key"
            {...form.getInputProps("openaiKey")}
          />

          <Button type="submit">Save</Button>
        </Stack>
      </Box>
    </>
  );
}
