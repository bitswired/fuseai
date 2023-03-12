import {
  getTemplateVariablesAsObject,
  getTemplateVariablesRegex,
} from "@/features/template";
import { type AppRouter } from "@/server/api/root";
import { api } from "@/utils/api";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  LoadingOverlay,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { type Template } from "@prisma/client";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import type FuseType from "fuse.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface SearchProps {
  filterQuery: string;
  setFilterQuery: (value: string) => void;
}
function Search({ filterQuery, setFilterQuery }: SearchProps) {
  const context = api.useContext();
  const createTemplate = api.templates.upsertTemplate.useMutation({
    onSuccess: () => {
      form.reset();
      toggleCreateOpened();
      context.invalidate().catch(console.error);
    },
  });

  const form = useForm({
    initialValues: {
      name: "",
      prompt: "",
    },
  });

  const [isCreateOpened, toggleCreateOpened] = useToggle();

  return (
    <Group w="max-content" m="auto">
      <TextInput
        value={filterQuery}
        icon={<IconSearch />}
        w="100vw"
        sx={{ maxWidth: "700px" }}
        onChange={(e) => setFilterQuery(e.currentTarget.value)}
      />
      <Button onClick={() => toggleCreateOpened()}>Create Template</Button>
      <Modal opened={isCreateOpened} onClose={toggleCreateOpened}>
        <LoadingOverlay visible={createTemplate.isLoading} />
        <Stack>
          <Text weight="bold">
            Write a template. You can use {} notation to make smart templates.
          </Text>

          <form onSubmit={form.onSubmit((v) => createTemplate.mutate(v))}>
            <Stack>
              <TextInput
                placeholder="Name ..."
                {...form.getInputProps("name")}
              />
              <Textarea
                placeholder="Template ..."
                maxRows={20}
                autosize
                minRows={5}
                {...form.getInputProps("prompt")}
              />
              <Button type="submit" fullWidth>
                Create Template
              </Button>
            </Stack>
          </form>
        </Stack>
      </Modal>
    </Group>
  );
}

type RouterOutput = inferRouterOutputs<AppRouter>;
type GetPromptsFromRepoOutput =
  RouterOutput["templates"]["getTemplatesFromRepo"];
type RouterInput = inferRouterInputs<AppRouter>;
type SeedInput = RouterInput["chat"]["seedChatFromTemplate"];
type SmartSeedInput = RouterInput["chat"]["smartSeedChatFromTemplate"];

interface PromptsProps {
  templates: Template[];
  seed: (input: SeedInput) => void;
  smartSeed: (input: SmartSeedInput) => void;
}

function Prompts({ templates, seed, smartSeed }: PromptsProps) {
  const [smartId, setSmartId] = useState<number>();
  const form = useForm({
    initialValues: {},
  });
  const formEdit = useForm({
    initialValues: {
      name: "",
      prompt: "",
    },
  });
  const context = api.useContext();
  const removeTemplate = api.templates.removeTemplate.useMutation({
    onSuccess: () => {
      context.invalidate().catch(console.error);
    },
  });

  useEffect(() => {
    if (smartId) {
      form.reset();
      const y = templates?.[smartId - 1]?.prompt;
      const x = getTemplateVariablesAsObject(y || "");
      x && form.setValues(x);
    }
  }, [smartId]);

  const [isEditing, toggleIsEditing] = useToggle();

  const upsertTemplate = api.templates.upsertTemplate.useMutation({
    onSuccess: () => {
      form.reset();
      toggleIsEditing();
      context.invalidate().catch(console.error);
    },
  });

  return (
    <SimpleGrid cols={4} p={32}>
      {templates.map((template, i) => (
        <Card key={i} shadow="sm" padding="lg" radius="md" withBorder>
          {/* <Card.Section component="a" href="https://mantine.dev/">
                  sdfs
                </Card.Section> */}

          <ActionIcon
            top={5}
            right={40}
            pos="absolute"
            onClick={() => {
              formEdit.setValues({ ...template });
              toggleIsEditing();
            }}
          >
            <ThemeIcon color="orange" variant="light">
              <IconEdit size={12} />
            </ThemeIcon>
          </ActionIcon>

          <ActionIcon
            top={5}
            right={5}
            pos="absolute"
            onClick={() => removeTemplate.mutate({ id: template.id })}
          >
            <ThemeIcon color="red" variant="light">
              <IconTrash size={12} />
            </ThemeIcon>
          </ActionIcon>

          <Stack h="7em" spacing={3}>
            {getTemplateVariablesRegex(template.prompt) && (
              <Badge color="cyan" variant="filled" w="max-content">
                Smart Template
              </Badge>
            )}
            <Group position="apart" mt="md" mb="xs">
              <Text variant="light">{template.name}</Text>
            </Group>

            <Text size="sm" color="dimmed" lineClamp={4}>
              {template.prompt}
            </Text>
          </Stack>

          <Button
            variant="light"
            fullWidth
            mt="md"
            radius="md"
            onClick={() => {
              if (getTemplateVariablesRegex(template.prompt)) {
                setSmartId(i + 1);
              } else {
                seed({ template: template.prompt });
              }
            }}
          >
            Start From This Template
          </Button>
        </Card>
      ))}
      <Modal opened={!!smartId} onClose={() => setSmartId(undefined)}>
        <Text weight="bold">You opened a smart template</Text>

        {smartId && (
          <form
            onSubmit={form.onSubmit((v) => {
              smartSeed({
                template: templates?.[smartId - 1]?.prompt || "",
                variables: v,
              });
            })}
          >
            <Stack>
              <Text>{templates[smartId]?.prompt}</Text>
              {getTemplateVariablesRegex(
                templates?.[smartId - 1]?.prompt || ""
              )?.map((v) =>
                v ? (
                  <TextInput
                    key={v}
                    placeholder={v}
                    {...form.getInputProps(v)}
                  />
                ) : null
              )}
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        )}
      </Modal>
      <Modal opened={isEditing} onClose={toggleIsEditing}>
        <LoadingOverlay visible={upsertTemplate.isLoading} />
        <Stack>
          <Text weight="bold">
            Write a template. You can use {} notation to make smart templates.
          </Text>

          <form onSubmit={formEdit.onSubmit((v) => upsertTemplate.mutate(v))}>
            <Stack>
              <TextInput
                placeholder="Name ..."
                {...formEdit.getInputProps("name")}
              />
              <Textarea
                placeholder="Template ..."
                maxRows={20}
                autosize
                minRows={5}
                {...formEdit.getInputProps("prompt")}
              />
              <Button type="submit" fullWidth>
                Update Template
              </Button>
            </Stack>
          </form>
        </Stack>
      </Modal>
    </SimpleGrid>
  );
}

export default function ImportTemplatesPage() {
  const templates = api.templates.getTemplates.useQuery();
  const [fuse, setFuse] = useState<FuseType<Template>>();

  const [filterQuery, setFilterQuery] = useState("");
  const router = useRouter();

  const seed = api.chat.seedChatFromTemplate.useMutation({
    onSuccess: (res) => {
      router.push(`/chats/${res.id}`).catch(console.error);
    },
  });

  const smartSeed = api.chat.smartSeedChatFromTemplate.useMutation({
    onSuccess: (res) => {
      router.push(`/chats/${res.id}`).catch(console.error);
    },
  });

  const visiblePrompts = fuse?.search(filterQuery).map((result) => result.item);

  useEffect(() => {
    const f = async () => {
      if (templates.data) {
        const Fuse = (await import("fuse.js")).default;
        const fuse = new Fuse(templates.data, { keys: ["name"] });
        setFuse(fuse);
      }
    };
    f().catch(console.error);
  }, [templates.data]);

  return (
    <>
      <Title m="auto" w="max-content" mb={32}>
        Manage Templates
      </Title>

      <Box pos="relative" w="100%">
        <LoadingOverlay visible={seed.isLoading} />

        <Search filterQuery={filterQuery} setFilterQuery={setFilterQuery} />

        {visiblePrompts && templates.data && (
          <Prompts
            templates={
              visiblePrompts.length > 0 ? visiblePrompts : templates.data
            }
            seed={seed.mutate}
            smartSeed={smartSeed.mutate}
          />
        )}
      </Box>
    </>
  );
}
