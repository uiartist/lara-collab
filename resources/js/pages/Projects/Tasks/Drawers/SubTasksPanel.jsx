import { ActionIcon, Badge, Box, Button, Checkbox, Group, Loader, Select, Stack, Text, TextInput, Tooltip, rem } from '@mantine/core';
import { IconDeviceFloppy, IconPencil, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

const EMPTY_FORM = {
  name: '',
  assigned_to_user_id: '',
  due_on: '',
  pricing_type: 'hourly',
  hidden_from_clients: false,
  billable: true,
};

export default function SubTasksPanel({ task }) {
  const { usersWithAccessToProject } = usePage().props;

  const [subTasks, setSubTasks]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editForm, setEditForm]   = useState({});

  const fetchSubTasks = () => {
    if (!task?.id) return;
    setLoading(true);
    axios
      .get(route('projects.tasks.sub-tasks.index', [task.project_id, task.id]))
      .then((res) => setSubTasks(res.data.sub_tasks || []))
      .catch(() => setSubTasks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubTasks();
  }, [task?.id]);

  const handleAdd = () => {
    if (!form.name.trim()) return;
    setSaving(true);
    axios
      .post(route('projects.tasks.sub-tasks.store', [task.project_id, task.id]), {
        name: form.name,
        assigned_to_user_id: form.assigned_to_user_id || null,
        due_on: form.due_on || null,
        pricing_type: form.pricing_type,
        hidden_from_clients: form.hidden_from_clients,
        billable: form.billable,
        description: null,
        estimation: null,
        fixed_price: null,
      })
      .then((res) => {
        setSubTasks((prev) => [...prev, res.data.sub_task]);
        setForm(EMPTY_FORM);
        setAddingNew(false);
      })
      .catch((err) => {
        console.error('Failed to create sub-task', err);
      })
      .finally(() => setSaving(false));
  };

  const startEdit = (subTask) => {
    setEditingId(subTask.id);
    setEditForm({
      name: subTask.name,
      assigned_to_user_id: subTask.assigned_to_user_id?.toString() || '',
      due_on: subTask.due_on || '',
      pricing_type: subTask.pricing_type || 'hourly',
      hidden_from_clients: subTask.hidden_from_clients ?? false,
      billable: subTask.billable ?? true,
    });
  };

  const handleUpdate = (subTask) => {
    setSaving(true);
    axios
      .put(route('projects.tasks.sub-tasks.update', [task.project_id, task.id, subTask.id]), {
        name: editForm.name,
        assigned_to_user_id: editForm.assigned_to_user_id || null,
        due_on: editForm.due_on || null,
        pricing_type: editForm.pricing_type,
        hidden_from_clients: editForm.hidden_from_clients,
        billable: editForm.billable,
      })
      .then((res) => {
        setSubTasks((prev) =>
          prev.map((t) => (t.id === subTask.id ? res.data.sub_task : t))
        );
        setEditingId(null);
      })
      .catch((err) => console.error('Failed to update sub-task', err))
      .finally(() => setSaving(false));
  };

  const handleDelete = (subTask) => {
    if (!window.confirm(`Archive sub-task "${subTask.name}"?`)) return;
    axios
      .delete(route('projects.tasks.sub-tasks.destroy', [task.project_id, task.id, subTask.id]))
      .then(() => setSubTasks((prev) => prev.filter((t) => t.id !== subTask.id)))
      .catch((err) => console.error('Failed to archive sub-task', err));
  };

  const userOptions = (usersWithAccessToProject || []).map((u) => ({
    value: u.id.toString(),
    label: u.name,
  }));

  return (
    <Box mt="lg" ml={24} mr={24}>
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="sm">Sub-tasks</Text>
        {!addingNew && (
          <Button
            size="xs"
            variant="light"
            leftSection={<IconPlus size={12} />}
            onClick={() => { setAddingNew(true); setEditingId(null); }}
          >
            Add sub-task
          </Button>
        )}
      </Group>

      {loading && <Loader size="xs" />}

      <Stack gap={6}>
        {subTasks.map((st) =>
          editingId === st.id ? (
            <Box key={st.id} p="xs" style={{ border: '1px solid var(--mantine-color-blue-3)', borderRadius: 6 }}>
              <TextInput
                size="xs"
                placeholder="Sub-task name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                mb={6}
              />
              <Select
                size="xs"
                placeholder="Assignee"
                clearable
                data={userOptions}
                value={editForm.assigned_to_user_id || null}
                onChange={(v) => setEditForm({ ...editForm, assigned_to_user_id: v || '' })}
                mb={6}
              />
              <Group gap={8} mt={4}>
                <Button
                  size="xs"
                  leftSection={<IconDeviceFloppy size={12} />}
                  loading={saving}
                  onClick={() => handleUpdate(st)}
                >
                  Save
                </Button>
                <Button size="xs" variant="subtle" color="gray" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              </Group>
            </Box>
          ) : (
            <Group key={st.id} justify="space-between" wrap="nowrap" p="xs"
              style={{ border: '1px solid var(--mantine-color-gray-2)', borderRadius: 6 }}
            >
              <Group gap={8} wrap="nowrap">
                <Text size="sm" fw={500}>#{st.number}</Text>
                <Text size="sm" truncate style={{ maxWidth: 320 }}>{st.name}</Text>
                {st.assigned_to_user && (
                  <Badge size="xs" variant="light">{st.assigned_to_user.name}</Badge>
                )}
                {st.completed_at && (
                  <Badge size="xs" color="green">Done</Badge>
                )}
              </Group>
              <Group gap={4} wrap="nowrap">
                <Tooltip label="Edit" openDelay={400} withArrow>
                  <ActionIcon size="sm" variant="subtle" onClick={() => startEdit(st)}>
                    <IconPencil style={{ width: rem(14) }} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Archive" openDelay={400} withArrow>
                  <ActionIcon size="sm" variant="subtle" color="red" onClick={() => handleDelete(st)}>
                    <IconTrash style={{ width: rem(14) }} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
          )
        )}

        {subTasks.length === 0 && !loading && !addingNew && (
          <Text size="xs" c="dimmed">No sub-tasks yet.</Text>
        )}
      </Stack>

      {addingNew && (
        <Box mt="sm" p="sm" style={{ border: '1px solid var(--mantine-color-blue-3)', borderRadius: 6 }}>
          <Text size="xs" fw={500} mb={6}>New sub-task</Text>
          <TextInput
            size="xs"
            placeholder="Sub-task name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            mb={6}
          />
          <Select
            size="xs"
            placeholder="Assignee (optional)"
            clearable
            data={userOptions}
            value={form.assigned_to_user_id || null}
            onChange={(v) => setForm({ ...form, assigned_to_user_id: v || '' })}
            mb={6}
          />
          <Group gap={8} mt={4}>
            <Button
              size="xs"
              leftSection={<IconDeviceFloppy size={12} />}
              loading={saving}
              onClick={handleAdd}
              disabled={!form.name.trim()}
            >
              Save
            </Button>
            <ActionIcon variant="subtle" color="gray" onClick={() => { setAddingNew(false); setForm(EMPTY_FORM); }}>
              <IconX size={14} />
            </ActionIcon>
          </Group>
        </Box>
      )}
    </Box>
  );
}
