import { Badge, Group, Loader, Modal, Table, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState, Fragment } from 'react';

const LEVEL_LABELS = ['Task', 'Sub Task', 'Assignment', 'Work List', 'Sub Work List'];
const getLevelLabel = depth => LEVEL_LABELS[depth] ?? `Level ${depth + 1}`;

const LEVEL_COLORS = ['blue', 'teal', 'violet', 'orange', 'pink'];
const getLevelColor = depth => LEVEL_COLORS[depth] ?? 'gray';

function fmtDate(val) {
  if (!val) return null;
  return dayjs(val).format('DD MMM YYYY');
}

function dateDiff(estimated, actual) {
  if (!estimated || !actual) return null;
  return dayjs(actual).diff(dayjs(estimated), 'day');
}

function NodeRow({ node, allNodes }) {
  const indent = (node.depth ?? 0) * 20;
  const diff = dateDiff(node.estimated_date, node.actual_date);
  const onTime = diff !== null && diff <= 0;

  return (
    <Table.Tr>
      <Table.Td>
        <Group gap={6} wrap="nowrap" style={{ paddingLeft: indent }}>
          <Badge size="xs" color={getLevelColor(node.depth ?? 0)} variant="light">
            {getLevelLabel(node.depth ?? 0)}
          </Badge>
          <Text size="sm" fw={500}>
            #{node.number} {node.name}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td ta="center">
        <Text size="sm" c={node.estimated_date ? undefined : 'dimmed'}>
          {fmtDate(node.estimated_date) ?? '—'}
        </Text>
      </Table.Td>
      <Table.Td ta="center">
        <Text size="sm" c={node.actual_date ? undefined : 'dimmed'}>
          {fmtDate(node.actual_date) ?? '—'}
        </Text>
      </Table.Td>
      <Table.Td ta="center">
        {diff === null ? (
          <Text size="sm" c="dimmed">—</Text>
        ) : (
          <Text size="sm" fw={600} c={onTime ? 'green' : 'red'}>
            {diff === 0 ? 'On time' : `${diff > 0 ? '+' : ''}${diff}d`}
          </Text>
        )}
      </Table.Td>
    </Table.Tr>
  );
}

function renderTree(nodeId, allNodes) {
  const node = allNodes.find(n => n.id === nodeId);
  if (!node) return null;
  const children = allNodes.filter(n => n.parent_id === nodeId);
  return (
    <>
      <NodeRow key={node.id} node={node} allNodes={allNodes} />
      {children.map(c => (
        <Fragment key={c.id}>{renderTree(c.id, allNodes)}</Fragment>
      ))}
    </>
  );
}

export default function HierarchyDatesModal({ opened, onClose, task, projectId }) {
  const [allNodes, setAllNodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (opened && task) fetchData();
  }, [opened, task]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(route('projects.tasks.descendants', [projectId, task.id]));

      const root = {
        ...task,
        estimated_date: data.root_estimated_date ?? task.estimated_date ?? null,
        actual_date:    data.root_actual_date    ?? task.actual_date    ?? null,
      };

      const descendants = (data.descendants || []).map(d => ({
        id:             d.id,
        parent_id:      d.parent_id,
        number:         d.number,
        name:           d.name,
        depth:          d.depth,
        estimated_date: d.estimated_date ?? null,
        actual_date:    d.actual_date    ?? null,
      }));

      setAllNodes([root, ...descendants]);
    } catch (e) {
      console.error(e);
      showNotification({ title: 'Error', message: 'Failed to load dates', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={task ? `Projected Dates — #${task.number}: ${task.name}` : 'Projected Dates'}
      size="90%"
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
          <Loader size="sm" />
        </div>
      ) : allNodes.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">No data</Text>
      ) : (
        <Table withTableBorder withColumnBorders striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Task</Table.Th>
              <Table.Th ta="center" w={145}>Est. Date</Table.Th>
              <Table.Th ta="center" w={145}>Actual Date</Table.Th>
              <Table.Th ta="center" w={120}>Variance</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {allNodes.length > 0 && renderTree(allNodes[0].id, allNodes)}
          </Table.Tbody>
        </Table>
      )}
    </Modal>
  );
}
