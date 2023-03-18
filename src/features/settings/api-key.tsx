import { api } from "@/utils/api";
import { Box, Button, LoadingOverlay, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";

export function ApiKey() {
  const settings = api.settings.getSettings.useQuery();
  const upsertSettings = api.settings.upsertSettings.useMutation({
    onSuccess: () =>
      notifications.show({
        title: "API Key Saved",
        message: "You're ready to Chat 🚀",
      }),
  });

  const form = useForm({
    initialValues: {
      openaiKey: "",
    },
  });

  useEffect(() => {
    if (settings.data) {
      const x = settings.data;
      form.setValues({ openaiKey: settings.data.openaiKey || "" });
    } else {
    }
  }, [settings.data]);

  return (
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
  );
}
