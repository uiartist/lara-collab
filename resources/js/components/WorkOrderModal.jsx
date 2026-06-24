import {
  Badge,
  Button,
  Center,
  Checkbox,
  FileInput,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

const LEVEL_LABELS = ['Task', 'Sub Task', 'Assignment', 'Work List', 'Sub Work List'];
const getLevelLabel = (depth) => LEVEL_LABELS[depth] ?? `Level ${depth + 1}`;

const LEVEL_COLORS = ['blue', 'teal', 'violet', 'orange', 'pink'];
const getLevelColor = (depth) => LEVEL_COLORS[depth] ?? 'gray';

const fmtCents = (cents) => {
  if (!cents) return '0.00';
  return (cents / 100).toFixed(2);
};

function fmtActual(value) {
  return Number(value).toFixed(2);
}

function cumulativeLoggedCosts(nodeId, allNodes) {
  const node = allNodes.find((n) => n.id === nodeId);
  if (!node) return 0;
  const children = allNodes.filter((n) => n.parent_id === nodeId);
  if (children.length === 0) return node.costs_total;
  return children.reduce((s, c) => s + cumulativeLoggedCosts(c.id, allNodes), 0);
}

function HierarchyTable({
  projectId,
  task,
  selectedTaskIds,
  onSelectedTaskIdsChange,
  error,
}) {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currency } = usePage().props;
  const currencySymbol = currency?.symbol ?? '$';

  useEffect(() => {
    if (!task) return;
    setLoading(true);
    axios
      .get(route('projects.tasks.hierarchy-costs', [projectId, task.id]))
      .then(({ data }) => setNodes(data.nodes))
      .catch(() =>
        showNotification({ title: 'Error', message: 'Failed to load hierarchy', color: 'red' })
      )
      .finally(() => setLoading(false));
  }, [projectId, task]);

  if (loading) {
    return (
      <Center py="md">
        <Loader size="sm" />
      </Center>
    );
  }

  if (!nodes.length) return null;

  const toggleTask = (nodeId, checked) => {
    if (checked) {
      onSelectedTaskIdsChange([...new Set([...selectedTaskIds, nodeId])]);
      return;
    }

    onSelectedTaskIdsChange(selectedTaskIds.filter((id) => id !== nodeId));
  };

  return (
    <>
      <Table withTableBorder withColumnBorders fz="sm" mb={error ? 4 : 'lg'}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={48}></Table.Th>
            <Table.Th>Level</Table.Th>
            <Table.Th>#</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th ta="right">Estimated</Table.Th>
            <Table.Th ta="right">Incurred Cost</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {nodes.map((node) => {
            const effectiveActual = cumulativeLoggedCosts(node.id, nodes);
            const checked = selectedTaskIds.includes(node.id);

            return (
              <Table.Tr key={node.id}>
                <Table.Td>
                  <Checkbox
                    aria-label={`Select task ${node.number}`}
                    checked={checked}
                    onChange={(event) => toggleTask(node.id, event.currentTarget.checked)}
                  />
                </Table.Td>
                <Table.Td>
                  <Badge size="xs" color={getLevelColor(node.depth ?? 0)} variant="light">
                    {getLevelLabel(node.depth ?? 0)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    #{node.number}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text
                    size="sm"
                    fw={node.depth === 0 ? 600 : 400}
                    style={{ paddingLeft: (node.depth ?? 0) * 16 }}
                  >
                    {node.name}
                  </Text>
                </Table.Td>
                <Table.Td ta="right">
                  <Text size="sm">
                    {currencySymbol}{fmtCents(node.estimated_budget)}
                  </Text>
                </Table.Td>
                <Table.Td ta="right">
                  <Text size="sm" fw={node.depth === 0 ? 600 : 400}>
                    {currencySymbol}{fmtActual(effectiveActual)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
      {error && (
        <Text size="xs" c="red" mb="lg">
          {error}
        </Text>
      )}
    </>
  );
}

const initialForm = {
  supplier_id: null,
  subject: '',
  notes: '',
  selected_task_ids: [],
  attachments: [],
};

export default function WorkOrderModal({ opened, onClose, projectId, task }) {
  const { auth } = usePage().props;

  const [suppliers, setSuppliers] = useState([]);
  const [suppliersLoaded, setSuppliersLoaded] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (opened && !suppliersLoaded) {
      axios
        .get(route('purchase-requests.suppliers'))
        .then(({ data }) => {
          setSuppliers(data.map((s) => ({ value: String(s.id), label: s.name })));
          setSuppliersLoaded(true);
        })
        .catch(() =>
          showNotification({ title: 'Error', message: 'Failed to load suppliers', color: 'red' })
        );
    }
  }, [opened, suppliersLoaded]);

  useEffect(() => {
    if (opened && task) {
      setForm((prev) => ({ ...prev, selected_task_ids: [task.id] }));
    }
  }, [opened, task]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.supplier_id) e.supplier_id = 'Please select a supplier.';
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (!form.selected_task_ids.length) e.selected_task_ids = 'Select at least one related task.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('supplier_id', form.supplier_id);
      payload.append('subject', form.subject);
      payload.append('notes', form.notes ?? '');
      form.selected_task_ids.forEach((id) => payload.append('selected_task_ids[]', id));
      form.attachments.forEach((file) => payload.append('attachments[]', file));

      await axios.post(route('tasks.purchase-requests.store', task.id), payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showNotification({
        title: 'Purchase request sent',
        message: 'The order was emailed to the supplier successfully.',
        color: 'teal',
      });

      setForm(initialForm);
      setErrors({});
      onClose();
    } catch (err) {
      const serverErrors = err?.response?.data?.errors ?? {};
      if (Object.keys(serverErrors).length) {
        const mapped = {};
        for (const [key, messages] of Object.entries(serverErrors)) {
          const field = key.startsWith('attachments.') ? 'attachments' : key;
          mapped[field] = Array.isArray(messages) ? messages[0] : messages;
        }
        setErrors(mapped);
      } else {
        showNotification({ title: 'Error', message: 'Failed to send purchase request.', color: 'red' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Text fw={600} size="md">
          Work Order - {task ? `#${task.number} ${task.name}` : ''}
        </Text>
      }
      size="lg"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      {task && (
        <HierarchyTable
          projectId={projectId}
          task={task}
          selectedTaskIds={form.selected_task_ids}
          onSelectedTaskIdsChange={(ids) => updateField('selected_task_ids', ids)}
          error={errors.selected_task_ids}
        />
      )}

      <Text fw={600} size="sm" mb="sm">
        Create Purchase Request
      </Text>

      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          <TextInput
            label="From"
            value={auth?.user?.name ?? ''}
            readOnly
            disabled
          />

          <Select
            label="To (Supplier)"
            placeholder="Select supplier"
            data={suppliers}
            value={form.supplier_id}
            onChange={(val) => updateField('supplier_id', val)}
            error={errors.supplier_id}
            searchable
            required
          />

          <TextInput
            label="Subject"
            placeholder="Order subject"
            value={form.subject}
            onChange={(e) => updateField('subject', e.target.value)}
            error={errors.subject}
            required
          />

          <Textarea
            label="Notes (optional)"
            placeholder="Additional notes to include in the email"
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            error={errors.notes}
            rows={3}
          />

          <FileInput
            label="Add attachments"
            placeholder="Choose files"
            value={form.attachments}
            onChange={(files) => updateField('attachments', files ?? [])}
            error={errors.attachments}
            multiple
            clearable
          />

          <Group justify="flex-end" mt="sm">
            <Button variant="subtle" onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Send Order via Email
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
