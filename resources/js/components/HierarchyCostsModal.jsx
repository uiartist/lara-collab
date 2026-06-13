import { openConfirmModal } from '@/components/ConfirmModal';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  NumberInput,
  ScrollArea,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconChevronDown, IconChevronRight, IconPlus, IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Fragment, useEffect, useMemo, useState } from 'react';

const LEVEL_LABELS = ['Task', 'Sub Task', 'Assignment', 'Work List', 'Sub Work List'];
const getLevelLabel = depth => LEVEL_LABELS[depth] ?? `Level ${depth + 1}`;

const LEVEL_COLORS = ['blue', 'teal', 'violet', 'orange', 'pink'];
const getLevelColor = depth => LEVEL_COLORS[depth] ?? 'gray';

const today = () => new Date().toISOString().slice(0, 10);

/** Format cents to 2-decimal string */
const fmtCents = cents => {
  if (!cents) return '0.00';
  return (cents / 100).toFixed(2);
};

/** Recursively sum costs_total (logged TaskCost entries) across the subtree.
 *  Leaf nodes contribute their own costs_total; parents sum their children. */
function cumulativeLoggedCosts(nodeId, allNodes) {
  const node = allNodes.find(n => n.id === nodeId);
  if (!node) return 0;
  const children = allNodes.filter(n => n.parent_id === nodeId);
  if (children.length === 0) return node.costs_total;
  return children.reduce((s, c) => s + cumulativeLoggedCosts(c.id, allNodes), 0);
}

/** Format a plain number (dollars) to 2-decimal display string */
function fmtActual(value) {
  return Number(value).toFixed(2);
}

function NodeRow({ node, allNodes, expanded, onToggle, onAddCost, onDeleteCost }) {
  const [addDate, setAddDate] = useState(today());
  const [addAmount, setAddAmount] = useState(null);
  const [addError, setAddError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const children = allNodes.filter(n => n.parent_id === node.id);
  const hasChildren = children.length > 0;

  // Actual = cumulative logged costs across this node's subtree
  const effectiveActual = cumulativeLoggedCosts(node.id, allNodes);

  // Profit: estimated_budget (cents) vs logged costs (dollars) → normalise to dollars
  const estimatedDollars = (node.estimated_budget || 0) / 100;
  const profit = estimatedDollars - effectiveActual;
  const profitLabel = profit >= 0 ? `+${profit.toFixed(2)}` : `-${Math.abs(profit).toFixed(2)}`;
  const profitColor = profit >= 0 ? 'teal' : 'red';

  const indent = (node.depth ?? 0) * 20;

  const handleAdd = async () => {
    if (!addAmount || Number(addAmount) <= 0) {
      setAddError('Amount must be > 0');
      return;
    }
    setAddError('');
    setSaving(true);
    await onAddCost(node.id, { date: addDate, amount: addAmount });
    setAddAmount(null);
    setAddDate(today());
    setSaving(false);
  };

  const handleDelete = cost => {
    openConfirmModal({
      type: 'danger',
      title: 'Delete cost',
      content: `Delete cost of ${Number(cost.amount).toFixed(2)}?`,
      confirmLabel: 'Delete',
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        setDeletingId(cost.id);
        await onDeleteCost(node.id, cost.id);
        setDeletingId(null);
      },
    });
  };

  return (
    <>
      {/* Main summary row */}
      <tr
        onClick={onToggle}
        style={{ cursor: 'pointer', backgroundColor: expanded ? 'var(--mantine-color-gray-0)' : undefined }}
      >
        <td>
          <Group gap={6} wrap="nowrap" style={{ paddingLeft: indent }}>
            <ActionIcon size="xs" variant="subtle" color="gray">
              {expanded ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
            </ActionIcon>
            <Badge size="xs" color={getLevelColor(node.depth ?? 0)} variant="light">
              {getLevelLabel(node.depth ?? 0)}
            </Badge>
            <Text size="sm" fw={500}>
              #{node.number} {node.name}
            </Text>
          </Group>
        </td>
        <td>
          <Text size="sm" ta="right">
            {fmtCents(node.estimated_budget)}
          </Text>
        </td>
        <td>
          <Text size="sm" ta="right">
            {fmtActual(effectiveActual)}
          </Text>
        </td>
        <td>
          <Text size="sm" ta="right" c={profitColor} fw={500}>
            {profitLabel}
          </Text>
        </td>
        <td>
          {!hasChildren && (
            <ActionIcon
              size="xs"
              variant="light"
              color="blue"
              title="Add cost"
              onClick={e => { e.stopPropagation(); if (!expanded) onToggle(); }}
            >
              <IconPlus size={12} />
            </ActionIcon>
          )}
        </td>
      </tr>

      {/* Expanded: cost entries + add form */}
      {expanded && (
        <tr onClick={e => e.stopPropagation()}>
          <td colSpan={5} style={{ backgroundColor: 'var(--mantine-color-gray-0)', padding: '8px 12px 8px ' + (indent + 40) + 'px' }}>
            {/* Existing cost entries */}
            {node.costs.length > 0 && (
              <Table withColumnBorders striped mb="xs" fz="xs">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>By</Table.Th>
                    <Table.Th w={36}></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {node.costs.map(c => (
                    <Table.Tr key={c.id}>
                      <Table.Td>{c.date ? dayjs(c.date).format('DD-MMM-YYYY') : '—'}</Table.Td>
                      <Table.Td>{Number(c.amount).toFixed(2)}</Table.Td>
                      <Table.Td>{c.user?.name ?? '—'}</Table.Td>
                      <Table.Td>
                        <ActionIcon
                          color="red"
                          size="xs"
                          variant="subtle"
                          onClick={e => { e.stopPropagation(); handleDelete(c); }}
                          disabled={deletingId !== null}
                        >
                          {deletingId === c.id ? <Loader size={10} /> : <IconTrash size={12} />}
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}

            {/* Add cost form — only for leaf nodes */}
            {!hasChildren && (
              <Group gap="xs" align="flex-end" onClick={e => e.stopPropagation()}>
                <TextInput
                  label="Date"
                  type="date"
                  size="xs"
                  value={addDate}
                  onChange={e => setAddDate(e.target.value)}
                  style={{ width: 140 }}
                />
                <NumberInput
                  label="Amount"
                  size="xs"
                  decimalScale={2}
                  min={0.01}
                  step={0.01}
                  value={addAmount ?? ''}
                  onChange={val => setAddAmount(val || null)}
                  error={addError}
                  style={{ width: 110 }}
                />
                <Button
                  size="xs"
                  leftSection={<IconPlus size={12} />}
                  loading={saving}
                  disabled={saving}
                  onClick={handleAdd}
                >
                  Add
                </Button>
              </Group>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function renderTree(nodeId, allNodes, expandedSet, onToggle, onAddCost, onDeleteCost) {
  const node = allNodes.find(n => n.id === nodeId);
  if (!node) return null;
  const children = allNodes.filter(n => n.parent_id === nodeId);
  return (
    <>
      <NodeRow
        node={node}
        allNodes={allNodes}
        expanded={expandedSet.has(node.id)}
        onToggle={() => onToggle(node.id)}
        onAddCost={onAddCost}
        onDeleteCost={onDeleteCost}
      />
      {children.map(c => (
        <Fragment key={c.id}>
          {renderTree(c.id, allNodes, expandedSet, onToggle, onAddCost, onDeleteCost)}
        </Fragment>
      ))}
    </>
  );
}

export default function HierarchyCostsModal({ opened, onClose, task, projectId, onCostChanged }) {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(new Set());

  useEffect(() => {
    if (opened && task) fetchData();
  }, [opened, task]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(route('projects.tasks.hierarchy-costs', [projectId, task.id]));
      setNodes(data.nodes);
      // auto-expand all nodes so add forms are visible at every level
      setExpanded(new Set(data.nodes.map(n => n.id)));
    } catch (e) {
      console.error(e);
      showNotification({ title: 'Error', message: 'Failed to load hierarchy costs', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = id => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const onAddCost = async (nodeId, { date, amount }) => {
    try {
      const { data } = await axios.post(route('projects.tasks.costs.store', [projectId, nodeId]), { date, amount });
      const newCost = {
        id: data.cost.id,
        amount: Number(data.cost.amount),
        date: data.cost.date,
        user: data.cost.user ?? null,
      };
      setNodes(prev =>
        prev.map(n =>
          n.id === nodeId
            ? { ...n, costs: [newCost, ...n.costs], costs_total: n.costs_total + Number(data.cost.amount) }
            : n,
        ),
      );
      onCostChanged?.();
      showNotification({ title: 'Cost added', message: `${Number(data.cost.amount).toFixed(2)} logged`, color: 'teal' });
    } catch (e) {
      console.error(e);
      showNotification({ title: 'Error', message: 'Failed to add cost', color: 'red' });
    }
  };

  const onDeleteCost = async (nodeId, costId) => {
    try {
      const node = nodes.find(n => n.id === nodeId);
      const cost = node?.costs.find(c => c.id === costId);
      await axios.delete(route('projects.tasks.costs.destroy', [projectId, nodeId, costId]));
      setNodes(prev =>
        prev.map(n =>
          n.id === nodeId
            ? {
                ...n,
                costs: n.costs.filter(c => c.id !== costId),
                costs_total: n.costs_total - (cost ? Number(cost.amount) : 0),
              }
            : n,
        ),
      );
      onCostChanged?.();
      showNotification({ title: 'Cost deleted', color: 'teal' });
    } catch (e) {
      console.error(e);
      showNotification({ title: 'Error', message: 'Failed to delete cost', color: 'red' });
    }
  };

  const grandTotalEstimated = useMemo(() => {
    if (!nodes.length) return 0;
    const root = nodes[0];
    return root.estimated_budget ? root.estimated_budget / 100 : 0;
  }, [nodes]);

  const grandTotalActual = useMemo(() => {
    if (!nodes.length) return 0;
    // Cumulative logged costs from the root
    return cumulativeLoggedCosts(nodes[0].id, nodes);
  }, [nodes]);

  const rootId = nodes.length ? nodes[0].id : null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={task ? `Costs — #${task.number}: ${task.name}` : 'Hierarchy Costs'}
      size="90%"
    >
      {loading ? (
        <Center style={{ minHeight: 200 }}>
          <Loader />
        </Center>
      ) : nodes.length === 0 ? (
        <Center style={{ minHeight: 100 }}>
          <Text c="dimmed">No data</Text>
        </Center>
      ) : (
        <ScrollArea>
          <Table withColumnBorders highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Task</Table.Th>
                <Table.Th ta="right" w={120}>Estimated</Table.Th>
                <Table.Th ta="right" w={120}>Actual Costs</Table.Th>
                <Table.Th ta="right" w={160}>Profit / Loss</Table.Th>
                <Table.Th w={40}></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rootId && renderTree(rootId, nodes, expanded, toggleExpanded, onAddCost, onDeleteCost)}
            </Table.Tbody>
            <Table.Tfoot>
              <Table.Tr>
                <Table.Td fw={700}>Total</Table.Td>
                <Table.Td fw={700} ta="right">{grandTotalEstimated.toFixed(2)}</Table.Td>
                <Table.Td fw={700} ta="right">{grandTotalActual.toFixed(2)}</Table.Td>
                <Table.Td
                  fw={700}
                  ta="right"
                  c={grandTotalEstimated - grandTotalActual >= 0 ? 'teal' : 'red'}
                >
                  {grandTotalEstimated - grandTotalActual >= 0
                    ? `+${(grandTotalEstimated - grandTotalActual).toFixed(2)}`
                    : `-${(grandTotalActual - grandTotalEstimated).toFixed(2)}`}
                </Table.Td>
                <Table.Td />
              </Table.Tr>
            </Table.Tfoot>
          </Table>
        </ScrollArea>
      )}
    </Modal>
  );
}
