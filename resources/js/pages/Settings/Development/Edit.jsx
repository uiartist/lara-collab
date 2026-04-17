import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/BackButton";
import useForm from "@/hooks/useForm";
import ContainerBox from "@/layouts/ContainerBox";
import Layout from "@/layouts/MainLayout";
import { redirectTo } from "@/utils/route";
import { usePage } from "@inertiajs/react";
import { Anchor, Breadcrumbs, Grid, Group, Select, TextInput, Title, Loader, Center } from "@mantine/core";

const DevelopmentEdit = () => {
  const { item, users = [] } = usePage().props;
  
  if (!item)
    return (
      <ContainerBox maw={700}>
        <Center style={{ height: 240 }}>
          <Loader />
        </Center>
      </ContainerBox>
    );

  const [form, submit, updateValue] = useForm(
    "post",
    route("settings.development.update", item.id),
    {
      _method: "put",
      user_id: item.user_id,
      name: item.name || "",
      key: item.key || "",
      secret: item.secret || "",
    }
  );

  return (
    <>
      <Breadcrumbs fz={14} mb={30}>
        <Anchor href="#" onClick={() => redirectTo("settings.development.index")} fz={14}>
          Development
        </Anchor>
        <div>Edit</div>
      </Breadcrumbs>

      <Grid justify="space-between" align="flex-end" gutter="xl" mb="lg">
        <Grid.Col span="auto">
          <Title order={1}>Edit credential</Title>
        </Grid.Col>
      </Grid>

      <ContainerBox maw={700}>
        <form onSubmit={submit}>
          <Select
            label="User"
            data={(users || []).map((u) => ({ value: String(u.id), label: u.name }))}
            value={String(form.data.user_id)}
            onChange={(val) => updateValue("user_id", val)}
            required
          />

          <TextInput label="Key" mt="md" value={form.data.key} onChange={(e) => updateValue("key", e.target.value)} />
          <TextInput label="Secret" mt="md" value={form.data.secret} onChange={(e) => updateValue("secret", e.target.value)} />

          <Group justify="space-between" mt="xl">
            <BackButton route="settings.development.index" />
            <ActionButton loading={form.processing}>Update</ActionButton>
          </Group>
        </form>
      </ContainerBox>
    </>
  );
};

DevelopmentEdit.layout = (page) => <Layout title="Edit credential">{page}</Layout>;

export default DevelopmentEdit;
