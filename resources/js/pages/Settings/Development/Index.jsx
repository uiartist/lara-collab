import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/BackButton";
import useForm from "@/hooks/useForm";
import ContainerBox from "@/layouts/ContainerBox";
import Layout from "@/layouts/MainLayout";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Breadcrumbs, Anchor, Grid, Group, Select, Title, TextInput, Table, ActionIcon } from "@mantine/core";
import { redirectTo } from "@/utils/route";
import { router } from "@inertiajs/react";
import { IconEdit, IconTrash } from "@tabler/icons-react";

const DevelopmentIndex = () => {
  const { items = [], users = [], selectedUser: initialSelectedUser = null } = usePage().props;

  const [selectedUser, setSelectedUser] = useState(initialSelectedUser ? String(initialSelectedUser) : null);

  const [form, submit, updateValue] = useForm("post", route("settings.development.store"), {
    user_id: null,
    name: "",
    key: "",
    secret: "",
  });

  useEffect(() => {
    if (initialSelectedUser) return setSelectedUser(String(initialSelectedUser));
    if (users && users.length && !selectedUser) setSelectedUser(String(users[0].id));
  }, [users]);

  useEffect(() => {
    if (selectedUser) updateValue("user_id", selectedUser);
  }, [selectedUser]);

  return (
    <>
      <Breadcrumbs fz={14} mb={30}>
        <Anchor href="#" onClick={() => redirectTo("settings.development.index")} fz={14}>
          Development
        </Anchor>
        <div>Credentials</div>
      </Breadcrumbs>

      <Grid justify="space-between" align="flex-end" gutter="xl" mb="lg">
        <Grid.Col span="auto">
          <Title order={1}>Development credentials</Title>
        </Grid.Col>
      </Grid>

      <ContainerBox maw={700}>
        <form
          onSubmit={(e) =>
            submit(e, {
              onSuccess: () => {
                updateValue("key", "");
                updateValue("secret", "");
              },
            })
          }
        >
          <Select
            label="User"
            data={(users || []).map((u) => ({ value: String(u.id), label: u.name }))}
            value={selectedUser}
            onChange={(val) => setSelectedUser(val)}
            required
          />

          <TextInput label="Key" mt="md" value={form.data.key} onChange={(e) => updateValue("key", e.target.value)} />
          <TextInput label="Secret" mt="md" value={form.data.secret} onChange={(e) => updateValue("secret", e.target.value)} />

          <Group justify="space-between" mt="xl">
            <BackButton route="settings.development.index" />
            <ActionButton loading={form.processing}>Save</ActionButton>
          </Group>
        </form>
      </ContainerBox>

      <ContainerBox mt="xl">
        <Title order={3} mb="md">
          Existing credentials
        </Title>

        <Table highlightOnHover>
          <thead>
            <tr>
              <th>User</th>
              <th>Key</th>
              <th>Secret</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(items.data || items).map((i) => (
              <tr key={i.id}>
                <td>{i.user ? i.user.name : "-"}</td>
                <td>{i.key}</td>
                <td>{i.secret ? "••••••••" : "-"}</td>
                <td>
                  <Group spacing="xs">
                    <ActionIcon
                      variant="light"
                      onClick={() => redirectTo("settings.development.edit", [i.id])}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>

                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => {
                        if (!confirm("Delete this credential?")) return;
                        router.delete(route("settings.development.destroy", i.id), {
                          onSuccess: () => redirectTo("settings.development.index"),
                        });
                      }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ContainerBox>
    </>
  );
};

DevelopmentIndex.layout = (page) => <Layout title="Development">{page}</Layout>;

export default DevelopmentIndex;
