import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Badge, Loader, Modal, Table, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

const LEVEL_COLORS = ['blue', 'violet', 'teal', 'orange', 'pink'];

function fmtDate(val) {
  if (!val) return <Text span c="dimmed" size="sm">—</Text>;
  return dayjs(val).format('DD MMM YYYY');
}

function dateDiff(estimated, actual) {
  if (!estimated || !actual) return null;
  const diff = dayjs(actual).diff(dayjs(estimated), 'day');
  return diff;
}

export default function ProjectDatesSummaryModal({ opened, onClose, projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (opened && projectId) fetchData();
  }, [opened, projectId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(route('projects.tasks.project-dates-summary', [projectId]));
      setTasks(data.tasks);
    } catch (e) {
      console.error(e);
      showNotification({ title: 'Error', message: 'Failed to load projected dates', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Projected Dates"
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
              <Table.Th ta="center" w={140}>Est. Date</Table.Th>
              <Table.Th ta="center" w={140}>Actual Date</Table.Th>
              <Table.Th ta="center" w={120}>Variance</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tasks.map(task => {
              const diff = dateDiff(task.estimated_date, task.actual_date);
              const onTime = diff !== null && diff <= 0;

              return (
                <Table.Tr key={task.id}>
                  <Table.Td>
                    <Badge size="xs" color={LEVEL_COLORS[task.depth ?? 0]} variant="light" mr={6}>
                      Task
                    </Badge>
                    <Text span size="sm" fw={500}>
                      #{task.number} {task.name}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Text size="sm">{fmtDate(task.estimated_date)}</Text>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Text size="sm">{fmtDate(task.actual_date)}</Text>
                  </Table.Td>
                  <Table.Td ta="center">
                    {diff === null ? (
                      <Text size="sm" c="dimmed">—</Text>
                    ) : (
                      <Text size="sm" fw={600} c={onTime ? 'green' : 'red'}>
                        {diff === 0 ? 'On time' : `${onTime ? '' : '+'}${diff}d`}
                      </Text>
                    )}
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      )}
    </Modal>
  );
}
