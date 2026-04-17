import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/BackButton";
import useForm from "@/hooks/useForm";
import ContainerBox from "@/layouts/ContainerBox";
import Layout from "@/layouts/MainLayout";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
  Anchor,
  Breadcrumbs,
  Chip,
  Fieldset,
  Grid,
  Group,
  Select,
  Title,
} from "@mantine/core";
import { redirectTo } from "@/utils/route";

const ConfigurationIndex = () => {
  const {
    users = [],
    permissions = [],
    usersWithPermissions = [],
    selectedUser: initialSelectedUser = null,
  } = usePage().props;

  const [selectedUser, setSelectedUser] = useState(
    initialSelectedUser ? String(initialSelectedUser) : null
  );

  const [form, submit, updateValue] = useForm(
    "post",
    route("settings.configuration.permissions"),
    {
      user_id: null,
      permissions: [],
    }
  );

  useEffect(() => {
    if (initialSelectedUser) {
      setSelectedUser(String(initialSelectedUser));
    } else if (users && users.length && !selectedUser) {
      setSelectedUser(String(users[0].id));
    }
  }, [users, initialSelectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const u = usersWithPermissions.find((i) => String(i.id) === String(selectedUser));
      updateValue("user_id", selectedUser);
      updateValue("permissions", u ? u.permissions : []);
    }
  }, [selectedUser]);

  const toggle = (permissionId) => {
    form.data.permissions.includes(permissionId)
      ? updateValue(
          "permissions",
          form.data.permissions.filter((p) => p !== permissionId)
        )
      : updateValue("permissions", [...form.data.permissions, permissionId]);
  };

  return (
    <>
      <Breadcrumbs fz={14} mb={30}>
        <Anchor href="#" onClick={() => redirectTo("settings.configuration.index")} fz={14}>
          Configuration
        </Anchor>
        <div>Permissions</div>
      </Breadcrumbs>

      <Grid justify="space-between" align="flex-end" gutter="xl" mb="lg">
        <Grid.Col span="auto">
          <Title order={1}>User permissions</Title>
        </Grid.Col>
        <Grid.Col span="content"></Grid.Col>
      </Grid>

      <ContainerBox maw={700}>
        <form onSubmit={submit}>
          <Select
            label="User"
            data={(users || []).map((u) => ({ value: String(u.id), label: u.name }))}
            value={selectedUser}
            onChange={(val) => setSelectedUser(val)}
            required
          />

          <Title order={3} mt="xl">
            Permissions
          </Title>

          <Fieldset legend="Available permissions" mt="sm">
            <Chip.Group multiple>
              <Group justify="start" gap="sm">
                {(permissions || []).map((p) => (
                  <Chip
                    key={p.id}
                    radius="sm"
                    checked={form.data.permissions.includes(p.id)}
                    onClick={() => toggle(p.id)}
                  >
                    {p.label ?? p.name}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          </Fieldset>

          <Group justify="space-between" mt="xl">
            <BackButton route="settings.configuration.index" />
            <ActionButton loading={form.processing}>Save</ActionButton>
          </Group>
        </form>
      </ContainerBox>
    </>
  );
};

ConfigurationIndex.layout = (page) => <Layout title="Configuration">{page}</Layout>;

export default ConfigurationIndex;
