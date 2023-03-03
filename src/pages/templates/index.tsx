import { type AppRouter } from "@/server/api/root";
import { api } from "@/utils/api";
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import type FuseType from "fuse.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface SearchProps {
  filterQuery: string;
  setFilterQuery: (value: string) => void;
}
function Search({ filterQuery, setFilterQuery }: SearchProps) {
  return (
    <TextInput
      value={filterQuery}
      icon={<IconSearch />}
      m="auto"
      sx={{ maxWidth: "700px" }}
      onChange={(e) => setFilterQuery(e.currentTarget.value)}
    />
  );
}

type RouterOutput = inferRouterOutputs<AppRouter>;
type GetPromptsFromRepoOutput =
  RouterOutput["templates"]["getTemplatesFromRepo"];
type RouterInput = inferRouterInputs<AppRouter>;
type SeedInput = RouterInput["chat"]["seedChatFromTemplate"];

interface PromptsProps {
  templates: GetPromptsFromRepoOutput;
  seed: (input: SeedInput) => void;
}

function Prompts({ templates, seed }: PromptsProps) {
  return (
    <SimpleGrid cols={4} p={32}>
      {templates.map((template, i) => (
        <Card key={i} shadow="sm" padding="lg" radius="md" withBorder>
          {/* <Card.Section component="a" href="https://mantine.dev/">
                  sdfs
                </Card.Section> */}

          <Stack h="7em" spacing={3}>
            <Group position="apart" mt="md" mb="xs">
              <Badge color="pink" variant="light">
                {template.act}
              </Badge>
            </Group>

            <Text size="sm" color="dimmed" lineClamp={4}>
              {template.prompt}
            </Text>
          </Stack>

          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            onClick={() => seed({ template: template.prompt })}
          >
            Start from this template
          </Button>
        </Card>
      ))}
    </SimpleGrid>
  );
}

export default function TemplatesPage() {
  const templates = api.templates.getTemplatesFromRepo.useQuery();
  const [fuse, setFuse] = useState<FuseType<GetPromptsFromRepoOutput[0]>>();

  const [filterQuery, setFilterQuery] = useState("");
  const router = useRouter();

  const seed = api.chat.seedChatFromTemplate.useMutation({
    onSuccess: (res) => {
      router.push(`/chats/${res.id}`).catch(console.error);
    },
  });

  const visiblePrompts = fuse?.search(filterQuery).map((result) => result.item);

  useEffect(() => {
    const f = async () => {
      if (templates.data) {
        const Fuse = (await import("fuse.js")).default;
        const fuse = new Fuse(templates.data, { keys: ["act"] });
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
        />
      )}
    </Box>
  );
}
