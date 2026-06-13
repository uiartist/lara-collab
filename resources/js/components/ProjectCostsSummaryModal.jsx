import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Badge, Loader, Modal, Table, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

const LEVEL_COLORS = ['blue', 'violet', 'teal', 'orange', 'pink'];

function fmtCents(cents) {
  if (!cents) return '0.00';
  return (cents / 100).toFixed(2);
}

function fmtDollars(val) {
  return Number(val || 0).toFixed(2);
}

export default function ProjectCostsSummaryModal({ opened, onClose, projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (opened && projectId) fetchData();
  }, [opened, projectId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(route('projects.tasks.project-costs-summary', [projectId]));
      setTasks(data.tasks);
    } catch (e) {
      console.error(e);
      showNotification({ title: 'Error', message: 'Failed to load project costs', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const totals = useMemo(() => {
    const estimated = tasks.reduce((s, t) => s + (t.estimated_budget || 0) / 100, 0);
    const actual = tasks.reduce((s, t) => s + Number(t.costs_total || 0), 0);
    return { estimated, actual, profit: estimated - actual };
  }, [tasks]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Project Costs Summary"
      size="xl"
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
          <Loader size="sm" />
        </div>
      ) : tasks.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">No tasks found</Text>
      ) : (
        <Table withTableBorder withColumnBorders striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Task</Table.Th>
              <Table.Th ta="right" w={130}>Estimated</Table.Th>
              <Table.Th ta="right" w={130}>Actual</Table.Th>
              <Table.Th ta="right" w={130}>Profit / Loss</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tasks.map(task => {
              const estimated = (task.estimated_budget || 0) / 100;
              const actual = Number(task.costs_total || 0);
              const profit = estimated - actual;
              const isProfit = profit >= 0;

              return (
                <Table.Tr key={task.id}>
                  <Table.Td>
                    <Badge size="xs" color={LEVEL_COLORS[0]} variant="light" mr={6}>
                      Task
                    </Badge>
                    <Text span size="sm" fw={500}>
                      #{task.number} {task.name}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm">{fmtCents(task.estimated_budget)}</Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm">{fmtDollars(task.costs_total)}</Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm" fw={600} c={isProfit ? 'green' : 'red'}>
                      {isProfit ? '+' : '-'}{Math.abs(profit).toFixed(2)}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
          <Table.Tfoot>
            <Table.Tr>
              <Table.Th>Total</Table.Th>
              <Table.Th ta="right">
                <Text size="sm" fw={700}>{totals.estimated.toFixed(2)}</Text>
              </Table.Th>
              <Table.Th ta="right">
                <Text size="sm" fw={700}>{totals.actual.toFixed(2)}</Text>
              </Table.Th>
              <Table.Th ta="right">
                <Text size="sm" fw={700} c={totals.profit >= 0 ? 'green' : 'red'}>
                  {totals.profit >= 0 ? '+' : '-'}{Math.abs(totals.profit).toFixed(2)}
                </Text>
              </Table.Th>
            </Table.Tr>
          </Table.Tfoot>
        </Table>
      )}
    </Modal>
  );
}
