import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/BackButton";
import useForm from "@/hooks/useForm";
import ContainerBox from "@/layouts/ContainerBox";
import Layout from "@/layouts/MainLayout";
import { redirectTo } from "@/utils/route";
import { usePage } from "@inertiajs/react";
import { Anchor, Breadcrumbs, Grid, Group, NativeSelect, TextInput, Title } from "@mantine/core";

const EntityCodeNumberCreate = () => {
  const { entityTypes } = usePage().props;

  const [form, submit, updateValue] = useForm("post", route("settings.code-numbers.store"), {
    entity_type: "",
    code_number: "",
  });

  return (
    <>
      <Breadcrumbs fz={14} mb={30}>
        <Anchor href="#" onClick={() => redirectTo("settings.code-numbers.index")} fz={14}>
          Entity Code Numbers
        </Anchor>
        <div>Create</div>
      </Breadcrumbs>

      <Grid justify="space-between" align="flex-end" gutter="xl" mb="lg">
        <Grid.Col span="auto">
          <Title order={1}>Create entity code number</Title>
        </Grid.Col>
        <Grid.Col span="content"></Grid.Col>
      </Grid>

      <ContainerBox maw={400}>
        <form onSubmit={submit}>
          <NativeSelect
            label="Entity"
            placeholder="Select entity type"
            required
            data={[
              { value: "", label: "Select entity type", disabled: true },
              ...Object.entries(entityTypes).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
            value={form.data.entity_type}
            onChange={(e) => updateValue("entity_type", e.currentTarget.value)}
            error={form.errors.entity_type}
          />
          <TextInput
            label="Code Number"
            placeholder="e.g. PR"
            description="Maximum 2 characters"
            required
            maxLength={2}
            mt="md"
            value={form.data.code_number}
            onChange={(e) => updateValue("code_number", e.target.value.toUpperCase())}
            error={form.errors.code_number}
          />

          <Group justify="space-between" mt="xl">
            <BackButton route="settings.code-numbers.index" />
            <ActionButton loading={form.processing}>Create</ActionButton>
          </Group>
        </form>
      </ContainerBox>
    </>
  );
};

EntityCodeNumberCreate.layout = (page) => <Layout title="Create entity code number">{page}</Layout>;

export default EntityCodeNumberCreate;