import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Group, TextInput, NumberInput, Table, Text, ActionIcon, Center, Loader } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconTrash, IconChevronUp } from '@tabler/icons-react';
import { openConfirmModal } from '@/components/ConfirmModal';
import dayjs from 'dayjs';

export default function TaskCostsModal({ opened, onClose, projectId, task }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState(null);
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (opened) fetchCosts();
  }, [opened, task]);

  const fetchCosts = async () => {
    setLoading(true);
    try {
      if (task) {
        const { data } = await axios.get(route('projects.tasks.costs', [projectId, task.id]));
        setCosts(data.costs || []);
      } else {
        const { data } = await axios.get(route('projects.tasks.costs.project', [projectId]));
        setCosts(data.task_costs || {});
      }
    } catch (e) {
      console.error(e);
      showNotification({ title: 'Error', message: 'Failed to load costs', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const err = {};
    if (!amount || Number(amount) <= 0) err.amount = 'Amount must be greater than 0';
    if (!date) err.date = 'Date is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const addCost = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const { data } = await axios.post(route('projects.tasks.costs.store', [projectId, task.id]), { amount, date });
      setCosts((c) => [data.cost, ...c]);
      setAmount(null);
      setDate(new Date().toISOString().slice(0, 10));
      setErrors({});
      showNotification({ title: 'Cost added', message: `Amount ${Number(data.cost.amount).toFixed(2)} added`, color: 'teal' });
    } catch (e) {
      console.error(e);
      showNotification({ title: 'Error', message: 'Failed to add cost', color: 'red' });
    } finally {
      setSaving(false);
    }
  };

  const deleteCost = (cost) => {
    openConfirmModal({
      type: 'danger',
      title: 'Delete cost',
      content: `Are you sure you want to delete this cost (${Number(cost.amount).toFixed(2)})?`,
      confirmLabel: 'Delete',
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        setDeletingId(cost.id);
        try {
          await axios.delete(route('projects.tasks.costs.destroy', [projectId, task.id, cost.id]));
          setCosts((c) => c.filter((x) => x.id !== cost.id));
          showNotification({ title: 'Cost deleted', message: `Deleted ${Number(cost.amount).toFixed(2)}`, color: 'teal' });
        } catch (e) {
          console.error(e);
          showNotification({ title: 'Error', message: 'Failed to delete cost', color: 'red' });
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const total = useMemo(() => {
    if (task) return costs.reduce((s, c) => s + Number(c.amount || 0), 0);
    // project-level: costs is an object grouped by taskId
    return Object.values(costs).reduce((s, entry) => s + Number(entry.total || 0), 0);
  }, [costs, task]);

  return (
    <Modal opened={opened} onClose={onClose} title={task ? `Costs for #${task.number}: ${task.name}` : 'Project Task Costs'} size="lg">
      {loading ? (
        <Center style={{ minHeight: 200, flexDirection: 'column' }}>
          <Loader />
          <Text mt="sm">Loading...</Text>
        </Center>
      ) : task ? (
        <div>
            <Group mb="md">
            <TextInput label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} error={errors.date} />
            <NumberInput label="Amount" precision={2} value={amount} onChange={(val) => setAmount(val)} min={0.01} error={errors.amount} />
            <Button onClick={addCost} loading={saving} disabled={saving || loading || !(amount > 0)}>
              Add
            </Button>
          </Group>

          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>User</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {costs.length === 0 && (
                <tr><td colSpan={4}><Center>No costs added</Center></td></tr>
              )}
              {costs.map((c) => (
                <tr key={c.id}>
                  <td>{c.date ? dayjs(c.date).format('DD-MMM-YYYY') : ''}</td>
                  <td>{Number(c.amount).toFixed(2)}</td>
                  <td>{c.user?.name || ''}</td>
                  <td>
                    <ActionIcon color="red" onClick={() => deleteCost(c)} title="Delete cost" disabled={deletingId !== null}>
                      {deletingId === c.id ? <Loader size={16} /> : <IconTrash size={16} />}
                    </ActionIcon>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td><Text fw={700}>Total</Text></td>
                <td><Text fw={700}>{total.toFixed(2)}</Text></td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </Table>
        </div>
      ) : (
        <div>
          <Text mb="md">Task-wise cost summary</Text>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Task</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(costs).length === 0 && (
                <tr><td colSpan={2}>No costs</td></tr>
              )}
              {Object.keys(costs).map((taskId) => {
                const entry = costs[taskId];
                const taskName = entry.items && entry.items[0] && entry.items[0].task ? `${entry.items[0].task.number}: ${entry.items[0].task.name}` : `Task ${taskId}`;
                return (
                  <tr key={taskId}>
                    <td>{taskName}</td>
                    <td>{Number(entry.total).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td><Text fw={700}>Project Total</Text></td>
                <td><Text fw={700}>{total.toFixed(2)}</Text></td>
              </tr>
            </tfoot>
          </Table>
        </div>
      )}
    </Modal>
  );
}
