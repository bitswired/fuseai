import { api } from "@/utils/api";
import {
  Button,
  Card,
  Group,
  Modal,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

export function AccountsSettings() {
  const [isCreateOpen, toggleCreate] = useToggle();

  const context = api.useContext();
  const removeUser = api.accounts.removeUser.useMutation({
    onSuccess: () => {
      context.invalidate().catch(console.error);
    },
  });
  const createUser = api.accounts.createUser.useMutation({
    onSuccess: () => {
      context.invalidate().catch(console.error);
      toggleCreate();
    },
  });
  const getUsers = api.accounts.getUsers.useQuery();

  const form = useForm({
    initialValues: {
      email: "",
    },
  });

  return (
    <>
      <Button leftIcon={<IconPlus />} onClick={() => toggleCreate()}>
        Create New User
      </Button>

      <SimpleGrid cols={4} mt={32}>
        {getUsers.data?.map((x) => (
          <Card
            key={x.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            p={32}
          >
            <Card.Section></Card.Section>

            <Text>{x.email}</Text>

            <Group position="apart" mt="md" mb="xs"></Group>

            <Button
              variant="light"
              fullWidth
              mt="md"
              radius="md"
              onClick={() => removeUser.mutate({ id: x.id })}
            >
              Delete
            </Button>
          </Card>
        ))}
      </SimpleGrid>

      <Modal opened={isCreateOpen} onClose={toggleCreate}>
        <form
          onSubmit={form.onSubmit((values) =>
            createUser.mutate({
              email: values.email,
            })
          )}
        >
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />

          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
