import {
  getTemplateVariablesAsObject,
  getTemplateVariablesRegex,
} from "@/features/template";
import { type AppRouter } from "@/server/api/root";
import { api } from "@/utils/api";
import {
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
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import type FuseType from "fuse.js";
import Image from "next/image";
import Link from "next/link";
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
  templates: GetPromptsFromRepoOutput;
  seed: (input: SeedInput) => void;
  smartSeed: (input: SmartSeedInput) => void;
}

function Prompts({ templates, seed, smartSeed }: PromptsProps) {
  const [smartId, setSmartId] = useState<number>();
  const form = useForm({
    initialValues: {},
  });

  useEffect(() => {
    if (smartId) {
      form.reset();
      const xx = templates?.[smartId]?.prompt;
      if (!xx) throw new Error("Invalid smart template");
      const x = getTemplateVariablesAsObject(xx);
      if (!x) throw new Error("Invalid smart template");
      form.setValues(x);
    }
  }, [smartId]);

  return (
    <SimpleGrid cols={4} p={32}>
      {templates.map((template, i) => (
        <Card key={i} shadow="sm" padding="lg" radius="md" withBorder>
          {/* <Card.Section component="a" href="https://mantine.dev/">
                  sdfs
                </Card.Section> */}

          <Stack h="7em" spacing={3}>
            {getTemplateVariablesRegex(template.prompt) && (
              <Badge color="cyan" variant="outline" w="max-content">
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
                setSmartId(i);
                // smartSeed({
                //   template: template.prompt,
                //   variables: { x: "lsdkjnf" },
                // });
              } else {
                seed({ template: template.prompt });
              }
            }}
          >
            Start from this template
          </Button>
        </Card>
      ))}
      <Modal opened={!!smartId} onClose={() => setSmartId(undefined)}>
        <Text weight="bold">You opened a smart template</Text>

        {smartId && (
          <form
            onSubmit={form.onSubmit((v) => {
              smartSeed({
                template: templates?.[smartId]?.prompt || "",
                variables: v,
              });
            })}
          >
            <Stack>
              <Text>{templates[smartId]?.prompt}</Text>
              {getTemplateVariablesRegex(
                templates?.[smartId]?.prompt || ""
              )?.map((v) => (
                <TextInput
                  key={v}
                  placeholder={v}
                  {...form.getInputProps(v || "")}
                />
              ))}
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        )}
      </Modal>
    </SimpleGrid>
  );
}

export function TemplatesPage() {
  const templates = api.templates.getTemplatesFromRepo.useQuery();
  const [fuse, setFuse] = useState<FuseType<GetPromptsFromRepoOutput[0]>>();

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
  );
}

export default function TemplatesHomePage() {
  return (
    <>
      <Title m="auto" w="max-content">
        Manage Templates
      </Title>
      <SimpleGrid m="auto" cols={2} mt={32} p={64}>
        <TemplateCategoyCard
          title="Your Templates"
          image="https://images.unsplash.com/photo-1530435460869-d13625c69bbf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dGVtcGxhdGVzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
          path="/templates/manage"
          description="Create, delete and generate new chats from your templates."
          cta="Manage Templates"
        />

        <TemplateCategoyCard
          title="Import Templates From Other Sources"
          image="https://images.unsplash.com/photo-1667984390527-850f63192709?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fGRpc3RyaWJ1dGVkJTIwY29tcHV0aW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
          path="/templates/import"
          description="Import templates from other sources to use them in your chats."
          cta="Import Templates"
        />
      </SimpleGrid>
    </>
  );
}
interface TemplateCategoyCardProps {
  title: string;
  path: string;
  image: string;
  description: string;
  cta: string;
}

function TemplateCategoyCard({
  title,
  path,
  image,
  description,
  cta,
}: TemplateCategoyCardProps) {
  return (
    <Card
      m="auto"
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      sx={{ maxWidth: "500px" }}
    >
      <Card.Section pos="relative" h={200}>
        <Image src={image} fill alt={title} style={{ objectFit: "cover" }} />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{title}</Text>
        {/* <Badge color="pink" variant="light">
          On Sale
        </Badge> */}
      </Group>

      <Text size="sm" color="dimmed">
        {description}
      </Text>

      <Link href={path}>
        <Button variant="light" fullWidth mt="md" radius="md">
          {cta}
        </Button>
      </Link>
    </Card>
  );
}
