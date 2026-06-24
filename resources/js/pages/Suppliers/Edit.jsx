import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/BackButton";
import useForm from "@/hooks/useForm";
import ContainerBox from "@/layouts/ContainerBox";
import Layout from "@/layouts/MainLayout";
import { redirectTo } from "@/utils/route";
import { usePage } from "@inertiajs/react";
import { Anchor, Breadcrumbs, Grid, Group, TextInput, Textarea, Title } from "@mantine/core";

const SupplierEdit = () => {
  const { item } = usePage().props;

  const [form, submit, updateValue] = useForm("put", route("suppliers.update", item.id), {
    name: item.name ?? "",
    email: item.email ?? "",
    phone: item.phone ?? "",
    address: item.address ?? "",
    contact_person: item.contact_person ?? "",
  });

  return (
    <>
      <Breadcrumbs fz={14} mb={30}>
        <Anchor href="#" onClick={() => redirectTo("suppliers.index")} fz={14}>
          Suppliers
        </Anchor>
        <div>Edit</div>
      </Breadcrumbs>

      <Grid justify="space-between" align="flex-end" gutter="xl" mb="lg">
        <Grid.Col span="auto">
          <Title order={1}>Edit supplier</Title>
        </Grid.Col>
      </Grid>

      <ContainerBox maw={600}>
        <form onSubmit={submit}>
          <Grid gutter="lg">
            <Grid.Col span={12}>
              <TextInput
                label="Name"
                placeholder="Supplier name"
                value={form.data.name}
                onChange={(e) => updateValue("name", e.target.value)}
                error={form.errors.name}
                required
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Email"
                placeholder="supplier@example.com"
                value={form.data.email}
                onChange={(e) => updateValue("email", e.target.value)}
                error={form.errors.email}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Phone"
                placeholder="+1 234 567 890"
                value={form.data.phone}
                onChange={(e) => updateValue("phone", e.target.value)}
                error={form.errors.phone}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Contact Person"
                placeholder="Contact person name"
                value={form.data.contact_person}
                onChange={(e) => updateValue("contact_person", e.target.value)}
                error={form.errors.contact_person}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Address"
                placeholder="Full address"
                value={form.data.address}
                onChange={(e) => updateValue("address", e.target.value)}
                error={form.errors.address}
                rows={3}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Group justify="flex-end">
                <BackButton onClick={() => redirectTo("suppliers.index")} />
                <ActionButton loading={form.processing}>Save</ActionButton>
              </Group>
            </Grid.Col>
          </Grid>
        </form>
      </ContainerBox>
    </>
  );
};

SupplierEdit.layout = (page) => <Layout title="Edit Supplier">{page}</Layout>;

export default SupplierEdit;
