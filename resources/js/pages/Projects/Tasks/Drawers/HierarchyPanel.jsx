import useTasksStore from '@/hooks/store/useTasksStore';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Loader,
  NumberInput,
  Text,
  TextInput,
} from '@mantine/core';
import { IconCheck, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

// Label for each depth level (0-based)
const LEVEL_LABELS = ['Task', 'Sub Task', 'Assignment', 'Work List', 'Sub Work List'];
const getLevelLabel = depth => LEVEL_LABELS[depth] ?? `Level ${depth + 1}`;

// Format integer cents as decimal string
const fmt = cents => {
  if (cents == null || cents === 0) return '0.00';
  return (cents / 100).toFixed(2);
};

// Normalize any date value to YYYY-MM-DD string (for <input type="date">)
const toDateInput = val => {
  if (!val) return '';
  if (typeof val === 'string' && val.length === 10) return val; // already YYYY-MM-DD
  return val.slice(0, 10); // trim ISO datetime to date part
};

// Shared column width constants
const COL = {
  estimated: 110,
  actual: 100,
  profit: 110,
  estDate: 125,
  actDate: 125,
  actions: 70,
};

// ─── Column header row ────────────────────────────────────────────────────────
function HeaderRow() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        padding: '6px 8px',
        background: 'var(--mantine-color-gray-1)',
        borderRadius: '4px 4px 0 0',
        borderBottom: '2px solid var(--mantine-color-gray-3)',
      }}
    >
      <div style={{ flex: 1 }}>
        <Text size='xs' fw={700} c='dimmed'>
          Name
        </Text>
      </div>
      <div style={{ width: COL.estimated }}>
        <Text size='xs' fw={700} c='dimmed' ta='right'>
          Estimated
        </Text>
      </div>
      <div style={{ width: COL.actual }}>
        <Text size='xs' fw={700} c='dimmed' ta='right' pr={4}>
          Actual
        </Text>
      </div>
      <div style={{ width: COL.profit }}>
        <Text size='xs' fw={700} c='dimmed' ta='right'>
          Profit / Loss
        </Text>
      </div>
      <div style={{ width: COL.estDate }}>
        <Text size='xs' fw={700} c='dimmed' ta='center'>
          Est. Date
        </Text>
      </div>
      <div style={{ width: COL.actDate }}>
        <Text size='xs' fw={700} c='dimmed' ta='center'>
          Actual Date
        </Text>
      </div>
      <div style={{ width: COL.actions }} />
    </div>
  );
}

// ─── Single node row (displays budget inputs and actions) ─────────────────────
function NodeRow({ node, depth, isRoot, onAddChild, onDelete, onBudgetSave, childrenTotalActual, hasChildren }) {
  const estimatedRef = useRef((node.estimated_budget || 0) / 100);
  const [estimated, setEstimated] = useState((node.estimated_budget || 0) / 100);
  const [estDate, setEstDate] = useState(toDateInput(node.estimated_date));
  const [actDate, setActDate] = useState(toDateInput(node.actual_date));

  // Re-sync local state when node prop updates (e.g. after save)
  useEffect(() => {
    const e = (node.estimated_budget || 0) / 100;
    estimatedRef.current = e;
    setEstimated(e);
    setEstDate(toDateInput(node.estimated_date));
    setActDate(toDateInput(node.actual_date));
  }, [node.estimated_budget, node.estimated_date, node.actual_date]);

  // Actual = cumulative logged costs from children (for parents) or self (for leaves)
  const effectiveActual = hasChildren ? childrenTotalActual : (node.costs_total || 0);
  const effectiveActualCents = effectiveActual * 100;
  const profit = (node.estimated_budget || 0) - effectiveActualCents;
  const isProfit = profit >= 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 8px',
        paddingLeft: depth * 24 + 8,
        borderBottom: '1px solid var(--mantine-color-gray-1)',
        background: depth === 0 ? 'var(--mantine-color-blue-0)' : undefined,
      }}
    >
      {/* Name */}
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <Group gap={6} wrap='nowrap'>
          <Badge size='xs' variant='light' color={depth === 0 ? 'blue' : 'gray'} style={{ flexShrink: 0 }}>
            {getLevelLabel(node.depth ?? depth)}
          </Badge>
          <Text size='sm' fw={depth <= 1 ? 600 : 500} truncate>
            #{node.number}&nbsp;{node.name}
          </Text>
        </Group>
      </div>

      {/* Estimated Budget */}
      <div style={{ width: COL.estimated }}>
        <NumberInput
          size='xs'
          value={estimated}
          min={0}
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          onChange={v => {
            estimatedRef.current = v;
            setEstimated(v);
          }}
          onBlur={() => onBudgetSave(node.id, 'estimated_budget', estimatedRef.current)}
        />
      </div>

      {/* Actual — always read-only, sourced from logged costs (costs_total) */}
      <div style={{ width: COL.actual }}>
        <Text size='sm' fw={600} ta='right' pr={4}>
          {effectiveActual.toFixed(2)}
        </Text>
      </div>

      {/* Profit / Loss */}
      <div style={{ width: COL.profit }}>
        <Text size='sm' fw={600} c={isProfit ? 'green' : 'red'} ta='right' pr={4}>
          {isProfit ? '+' : '-'}{fmt(Math.abs(profit))}
        </Text>
      </div>

      {/* Estimated Date */}
      <div style={{ width: COL.estDate }}>
        <input
          type='date'
          value={estDate}
          onChange={e => setEstDate(e.target.value)}
          onBlur={() => onBudgetSave(node.id, 'estimated_date', estDate || null)}
          style={{ width: '100%', fontSize: 12, padding: '2px 4px', border: '1px solid var(--mantine-color-gray-4)', borderRadius: 4 }}
        />
      </div>

      {/* Actual Date */}
      <div style={{ width: COL.actDate }}>
        <input
          type='date'
          value={actDate}
          onChange={e => setActDate(e.target.value)}
          onBlur={() => onBudgetSave(node.id, 'actual_date', actDate || null)}
          style={{ width: '100%', fontSize: 12, padding: '2px 4px', border: '1px solid var(--mantine-color-gray-4)', borderRadius: 4 }}
        />
      </div>

      {/* Actions */}
      <div style={{ width: COL.actions }}>
        <Group gap={4} wrap='nowrap'>
          <ActionIcon
            size='sm'
            variant='subtle'
            title='Add child'
            onClick={() => onAddChild(node.id)}
          >
            <IconPlus size={13} />
          </ActionIcon>
          {!isRoot && (
            <ActionIcon
              size='sm'
              variant='subtle'
              color='red'
              title='Archive'
              onClick={() => onDelete(node)}
            >
              <IconTrash size={13} />
            </ActionIcon>
          )}
        </Group>
      </div>
    </div>
  );
}

// ─── Summary row shown below a group of siblings ──────────────────────────────
function SummaryRow({ depth, parentEstimated, totalActual }) {
  const profit = parentEstimated - totalActual;
  const isProfit = profit >= 0;

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        padding: '4px 8px',
        paddingLeft: depth * 24 + 8,
        background: 'var(--mantine-color-gray-0)',
        borderBottom: '1px solid var(--mantine-color-gray-2)',
      }}
    >
      <div style={{ flex: 1 }}>
        <Text size='xs' c='dimmed' fs='italic'>
          Estimated – Actual
        </Text>
      </div>
      <div style={{ width: COL.estimated }}>
        <Text size='xs' fw={600} ta='right'>
          {fmt(parentEstimated)}
        </Text>
      </div>
      <div style={{ width: COL.actual }}>
        <Text size='xs' fw={600} ta='right' pr={4}>
          {fmt(totalActual)}
        </Text>
      </div>
      <div style={{ width: COL.profit }}>
        <Text size='xs' fw={700} c={isProfit ? 'green' : 'red'} ta='right' pr={4}>
          {isProfit ? '+' : '-'}{fmt(Math.abs(profit))}
        </Text>
      </div>
      <div style={{ width: COL.estDate }} />
      <div style={{ width: COL.actDate }} />
      <div style={{ width: COL.actions }} />
    </div>
  );
}

// ─── Inline "add child" form row ─────────────────────────────────────────────
function AddChildRow({ depth, labelDepth, form, setForm, onSave, onCancel, saving }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        paddingLeft: depth * 24 + 8,
        background: 'var(--mantine-color-blue-0)',
        borderBottom: '1px solid var(--mantine-color-blue-2)',
      }}
    >
      <div style={{ flex: 1 }}>
        <TextInput
          size='xs'
          placeholder={`${getLevelLabel(labelDepth ?? depth)} name…`}
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && onSave()}
          autoFocus
        />
      </div>
      <div style={{ width: COL.estimated }}>
        <NumberInput
          size='xs'
          placeholder='Estimated'
          value={form.estimated_budget}
          min={0}
          decimalScale={2}
          allowNegative={false}
          onChange={v => setForm(f => ({ ...f, estimated_budget: v }))}
        />
      </div>
      <div style={{ width: COL.actual }} />
      <div style={{ width: COL.profit }} />
      <div style={{ width: COL.estDate }} />
      <div style={{ width: COL.actDate }} />
      <div style={{ width: COL.actions }}>
        <Group gap={4}>
          <ActionIcon size='sm' color='green' variant='filled' loading={saving} onClick={onSave}>
            <IconCheck size={13} />
          </ActionIcon>
          <ActionIcon size='sm' variant='subtle' onClick={onCancel}>
            <IconX size={13} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}

// Cumulative logged costs (costs_total) for a node's subtree:
// leaf nodes contribute their own costs_total; parents sum their children.
function cumulativeLoggedCosts(nodeId, allNodes) {
  const node = allNodes.find(n => n.id === nodeId);
  if (!node) return 0;
  const children = allNodes.filter(n => n.parent_id === nodeId);
  if (children.length === 0) return node.costs_total || 0;
  return children.reduce((s, c) => s + cumulativeLoggedCosts(c.id, allNodes), 0);
}

// ─── Recursive node renderer ──────────────────────────────────────────────────
function NodeWithChildren({
  node,
  depth,
  allNodes,
  addingChildOf,
  addForm,
  setForm,
  setAddingChildOf,
  onBudgetSave,
  onDelete,
  onAddSubmit,
  saving,
  isRoot,
}) {
  const children = allNodes.filter(n => n.parent_id === node.id);
  const childTotalEst = children.reduce((s, c) => s + (c.estimated_budget || 0), 0);
  // Use cumulative logged costs so costs from deep descendants bubble up
  const childTotalAct = children.reduce((s, c) => s + cumulativeLoggedCosts(c.id, allNodes), 0);

  return (
    <>
      <NodeRow
        node={node}
        depth={depth}
        isRoot={isRoot}
        onAddChild={setAddingChildOf}
        onDelete={onDelete}
        onBudgetSave={onBudgetSave}
        hasChildren={children.length > 0}
        childrenTotalActual={childTotalAct}
      />

      {/* Render children recursively */}
      {children.map(child => (
        <NodeWithChildren
          key={child.id}
          node={child}
          depth={depth + 1}
          allNodes={allNodes}
          addingChildOf={addingChildOf}
          addForm={addForm}
          setForm={setForm}
          setAddingChildOf={setAddingChildOf}
          onBudgetSave={onBudgetSave}
          onDelete={onDelete}
          onAddSubmit={onAddSubmit}
          saving={saving}
          isRoot={false}
        />
      ))}

      {/* Inline add-child form */}
      {addingChildOf === node.id && (
        <AddChildRow
          depth={depth + 1}
          labelDepth={(node.depth ?? depth) + 1}
          form={addForm}
          setForm={setForm}
          saving={saving}
          onSave={onAddSubmit}
          onCancel={() => setAddingChildOf(null)}
        />
      )}

      {/* Summary row for direct children */}
      {children.length > 0 && (
        <SummaryRow
          depth={depth + 1}
          parentEstimated={node.estimated_budget || 0}
          totalActual={childTotalAct * 100}
        />
      )}
    </>
  );
}

// ─── Main HierarchyPanel component ───────────────────────────────────────────
export default function HierarchyPanel({ task, costsVersion, drawerOpened }) {
  const { updateTaskProperty } = useTasksStore();

  const [descendants, setDescendants] = useState([]);
  const [rootCostsTotal, setRootCostsTotal] = useState(0);
  const [rootDates, setRootDates] = useState({ estimated_date: null, actual_date: null });
  const [loading, setLoading] = useState(false);
  const [addingChildOf, setAddingChildOf] = useState(null); // parent node id
  const [addForm, setAddForm] = useState({ name: '', estimated_budget: '' });
  const [saving, setSaving] = useState(false);

  const fetchDescendants = () => {
    if (!task?.id) return;
    setLoading(true);
    axios
      .get(route('projects.tasks.descendants', [task.project_id, task.id]))
      .then(res => {
        setDescendants(res.data.descendants || []);
        setRootCostsTotal(res.data.root_costs_total ?? 0);
        setRootDates({
          estimated_date: res.data.root_estimated_date ?? null,
          actual_date: res.data.root_actual_date ?? null,
        });
      })
      .catch(() => setDescendants([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (drawerOpened) fetchDescendants();
  }, [task?.id, costsVersion, drawerOpened]);

  // All nodes visible in the tree: root (with costs_total + persisted dates injected) + descendants
  const allNodes = [{ ...task, costs_total: rootCostsTotal, ...rootDates }, ...descendants];

  const onBudgetSave = (nodeId, field, value) => {
    const isDateField = field === 'estimated_date' || field === 'actual_date';
    const storedValue = isDateField ? (value || null) : Math.round((value || 0) * 100);
    axios
      .patch(route('projects.tasks.budget.update', [task.project_id, nodeId]), {
        [field]: value, // backend handles conversion for budget; dates passed as-is
      })
      .then(() => {
        if (nodeId === task.id) {
          // For budget fields sync to store; date fields update local root state
          if (isDateField) {
            setRootDates(prev => ({ ...prev, [field]: storedValue }));
          } else {
            updateTaskProperty(task, field, storedValue);
          }
        } else {
          setDescendants(prev =>
            prev.map(n => (n.id === nodeId ? { ...n, [field]: storedValue } : n)),
          );
        }
      })
      .catch(err => console.error('Budget save failed', err));
  };

  const onAddSubmit = () => {
    if (!addForm.name.trim() || !addingChildOf) return;
    setSaving(true);
    axios
      .post(route('projects.tasks.sub-tasks.store', [task.project_id, addingChildOf]), {
        name: addForm.name,
        estimated_budget: addForm.estimated_budget || null,
        pricing_type: 'hourly',
        hidden_from_clients: false,
        billable: true,
      })
      .then(res => {
        setDescendants(prev => [...prev, res.data.sub_task]);
        setAddForm({ name: '', estimated_budget: '' });
        setAddingChildOf(null);
      })
      .catch(err => console.error('Add child failed', err))
      .finally(() => setSaving(false));
  };

  const onDelete = node => {
    if (!window.confirm(`Archive "${node.name}" and all its children?`)) return;
    axios
      .delete(
        route('projects.tasks.sub-tasks.destroy', [task.project_id, node.parent_id, node.id]),
      )
      .then(() => {
        // Collect node + all descendants to remove from flat list
        const collectIds = (id, list) => {
          const children = list.filter(n => n.parent_id === id).map(n => n.id);
          return [id, ...children.flatMap(cid => collectIds(cid, list))];
        };
        const toRemove = new Set(collectIds(node.id, descendants));
        setDescendants(prev => prev.filter(n => !toRemove.has(n.id)));
      })
      .catch(err => console.error('Delete failed', err));
  };

  if (!task) return null;

  return (
    <Box mt='lg' mx={24}>
      <Group justify='space-between' mb='xs'>
        <Text fw={600} size='sm'>
          Task Hierarchy &amp; Budget
        </Text>
        <Button
          size='xs'
          variant='light'
          leftSection={<IconPlus size={12} />}
          onClick={() => {
            setAddingChildOf(task.id);
            setAddForm({ name: '', estimated_budget: '', actual_budget: '' });
          }}
        >
          Add child
        </Button>
      </Group>

      <div
        style={{
          border: '1px solid var(--mantine-color-gray-3)',
          borderRadius: 4,
          overflow: 'auto',
        }}
      >
        <HeaderRow />

        {loading ? (
          <div style={{ padding: 16 }}>
            <Loader size='sm' />
          </div>
        ) : (
          <NodeWithChildren
            node={task}
            depth={0}
            allNodes={allNodes}
            addingChildOf={addingChildOf}
            addForm={addForm}
            setForm={setAddForm}
            setAddingChildOf={id => {
              setAddingChildOf(id);
              setAddForm({ name: '', estimated_budget: '', actual_budget: '' });
            }}
            onBudgetSave={onBudgetSave}
            onDelete={onDelete}
            onAddSubmit={onAddSubmit}
            saving={saving}
            isRoot
          />
        )}
      </div>
    </Box>
  );
}
