import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState, Fragment } from 'react';
import { ActionIcon, Badge, Button, Group, Loader, Modal, Table, Text } from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';

const LEVEL_LABELS = ['Task', 'Sub Task', 'Assignment', 'Work List', 'Sub Work List'];
const getLevelLabel = (depth) => LEVEL_LABELS[depth] ?? `Level ${depth + 1}`;

const LEVEL_COLORS = ['blue', 'teal', 'violet', 'orange', 'pink'];
const getLevelColor = (depth) => LEVEL_COLORS[depth] ?? 'gray';

function fmtDate(val) {
  if (!val) return <Text span c="dimmed" size="sm">—</Text>;
  return dayjs(val).format('DD MMM YYYY');
}

function dateDiff(estimated, actual) {
  if (!estimated || !actual) return null;
  const diff = dayjs(actual).diff(dayjs(estimated), 'day');
  return diff;
}

function TaskRow({ task, hasChildren, isCollapsed, onToggleCollapse }) {
  const diff = dateDiff(task.estimated_date, task.actual_date);
  const onTime = diff !== null && diff <= 0;

  return (
    <Table.Tr>
      <Table.Td>
        <Group gap={6} wrap="nowrap" style={{ paddingLeft: (task.depth ?? 0) * 20 }}>
          {hasChildren ? (
            <ActionIcon
              size='sm'
              variant='subtle'
              color='gray'
              onClick={() => onToggleCollapse(task.id)}
              style={{ flexShrink: 0 }}
            >
              {isCollapsed ? <IconChevronRight size={13} /> : <IconChevronDown size={13} />}
            </ActionIcon>
          ) : (
            <div style={{ width: 26, flexShrink: 0 }} />
          )}
          <Badge size="xs" color={getLevelColor(task.depth ?? 0)} variant="light">
            {getLevelLabel(task.depth ?? 0)}
          </Badge>
          <Text span size="sm" fw={500}>
            #{task.number} {task.name}
          </Text>
        </Group>
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
}

function renderTree(task, allTasks, collapsedNodes, onToggleCollapse) {
  // Use == (loose equality) to handle potential string/number type mismatches from the API
  const children = allTasks.filter(t => t.parent_id != null && t.parent_id == task.id);
  const isCollapsed = collapsedNodes.has(String(task.id));

  return (
    <Fragment key={task.id}>
      <TaskRow
        task={task}
        hasChildren={children.length > 0}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
      {!isCollapsed && children.map(child => renderTree(child, allTasks, collapsedNodes, onToggleCollapse))}
    </Fragment>
  );
}

export default function ProjectDatesSummaryModal({ opened, onClose, projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());

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

  const toggleCollapse = (nodeId) => {
    const key = String(nodeId);
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const rootTasks = tasks.filter(t => !t.parent_id || !tasks.some(parent => parent.id == t.parent_id));

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
        <>
          <Group mb="xs">
            <Button
              size='xs'
              variant='subtle'
              color='gray'
              onClick={() => {
                const parentIds = new Set(
                  tasks
                    .filter(t => tasks.some(d => d.parent_id != null && d.parent_id == t.id))
                    .map(t => String(t.id))
                );
                setCollapsedNodes(parentIds);
              }}
            >
              Collapse All
            </Button>
            <Button
              size='xs'
              variant='subtle'
              color='gray'
              onClick={() => setCollapsedNodes(new Set())}
            >
              Expand All
            </Button>
          </Group>
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
              {rootTasks.map(task => renderTree(task, tasks, collapsedNodes, toggleCollapse))}
            </Table.Tbody>
          </Table>
        </>
      )}
    </Modal>
  );
}
