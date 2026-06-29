import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/BackButton";
import useForm from "@/hooks/useForm";
import ContainerBox from "@/layouts/ContainerBox";
import Layout from "@/layouts/MainLayout";
import { redirectTo } from "@/utils/route";
import { usePage } from "@inertiajs/react";
import { Anchor, Breadcrumbs, Grid, Group, NativeSelect, TextInput, Title } from "@mantine/core";

const EntityCodeNumberEdit = () => {
  const { item, entityTypes } = usePage().props;
  const rangesAssigned = item.min_range !== null || item.max_range !== null;

  const [form, submit, updateValue] = useForm("post", route("settings.code-numbers.update", item.id), {
    _method: "put",
    entity_type: item.entity_type,
    code_number: item.code_number,
    min_range: item.min_range ?? "",
    max_range: item.max_range ?? "",
  });

  return (
    <>
      <Breadcrumbs fz={14} mb={30}>
        <Anchor href="#" onClick={() => redirectTo("settings.code-numbers.index")} fz={14}>
          Entity Code Numbers
        </Anchor>
        <div>Edit</div>
      </Breadcrumbs>

      <Grid justify="space-between" align="flex-end" gutter="xl" mb="lg">
        <Grid.Col span="auto">
          <Title order={1}>Edit entity code number</Title>
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
          <TextInput
            label="Min Range"
            placeholder="e.g. 1"
            description="Minimum sequence value for the generated codes"
            mt="md"
            type="number"
            value={form.data.min_range}
            onChange={(e) => updateValue("min_range", e.target.value)}
            error={form.errors.min_range}
            readOnly={rangesAssigned}
          />
          <TextInput
            label="Max Range"
            placeholder="e.g. 1000"
            description="Maximum sequence value for the generated codes"
            mt="md"
            type="number"
            value={form.data.max_range}
            onChange={(e) => updateValue("max_range", e.target.value)}
            error={form.errors.max_range}
            readOnly={rangesAssigned}
          />

          <Group justify="space-between" mt="xl">
            <BackButton route="settings.code-numbers.index" />
            <ActionButton loading={form.processing}>Update</ActionButton>
          </Group>
        </form>
      </ContainerBox>
    </>
  );
};

EntityCodeNumberEdit.layout = (page) => <Layout title="Edit entity code number">{page}</Layout>;

export default EntityCodeNumberEdit;