import {
  Badge,
  Button,
  Center,
  Checkbox,
  FileInput,
  Group,
  Loader,
  Modal,
  NumberInput,
  ScrollArea,
  Select,
  SimpleGrid,
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

const DEPARTMENT_OPTIONS = [
  'Planning & Design',
  'Project Management',
  'Site Operations',
  'Civil Engineering',
  'Structural Engineering',
  'MEP',
  'Quality Assurance',
  'Safety & Compliance',
  'Procurement',
  'Logistics',
  'Finance',
  'HR & Admin',
  'IT & Digital',
  'Warehouse',
  'Customer Support',
];

const WORK_ORDER_FIELDS = [
  'work_order_number',
  'work_order_date',
  'priority_level',
  'requested_by',
  'customer_id',
  'department',
  'country',
  'work_assigned_to',
  'expected_start_date',
  'expected_finish_date',
  'work_completed_by',
  'job_description',
  'bill_to_name',
  'bill_to_company',
  'bill_to_street_address',
  'bill_to_city_state_zip',
  'bill_to_phone',
  'ship_to_name',
  'ship_to_company',
  'ship_to_street_address',
  'ship_to_city_state_zip',
  'ship_to_phone',
  'shipping_handling_cost',
  'additional_info',
  'signature_name',
  'signature_date',
];

const emptyLaborItem = () => ({ description: '', hours: '', rate: '' });
const emptyMaterialItem = () => ({ part: '', tax: '', quantity: '', unit_price: '' });

const today = () => new Date().toISOString().slice(0, 10);

const createInitialForm = (auth, task) => ({
  supplier_id: null,
  subject: task ? `Work Order - #${task.number} ${task.name}` : '',
  work_order_number: task?.number ? String(task.number) : '',
  work_order_date: today(),
  priority_level: '',
  requested_by: auth?.user?.name ?? '',
  customer_id: '',
  department: '',
  country: '',
  work_assigned_to: '',
  expected_start_date: '',
  expected_finish_date: '',
  work_completed_by: '',
  job_description: task?.name ?? '',
  bill_to_name: '',
  bill_to_company: '',
  bill_to_street_address: '',
  bill_to_city_state_zip: '',
  bill_to_phone: '',
  ship_to_name: '',
  ship_to_company: '',
  ship_to_street_address: '',
  ship_to_city_state_zip: '',
  ship_to_phone: '',
  shipping_handling_cost: '',
  labor_items: [emptyLaborItem()],
  material_items: [emptyMaterialItem()],
  additional_info: '',
  signature_name: '',
  signature_date: '',
  notes: '',
  selected_task_ids: task?.id ? [task.id] : [],
  attachments: [],
});

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

function compactLineItems(items) {
  return items.filter((item) => Object.values(item).some((value) => value !== null && value !== ''));
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

export default function WorkOrderModal({ opened, onClose, projectId, task }) {
  const { auth } = usePage().props;

  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [countries, setCountries] = useState([]);
  const [suppliersLoaded, setSuppliersLoaded] = useState(false);
  const [form, setForm] = useState(() => createInitialForm(auth, task));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (opened && !suppliersLoaded) {
      Promise.all([
        axios.get(route('purchase-requests.suppliers')),
        axios.get(route('purchase-requests.departments')),
        axios.get(route('purchase-requests.countries')),
      ])
        .then(([suppliersResponse, departmentsResponse, countriesResponse]) => {
          const supplierOptions = suppliersResponse.data.map((s) => ({ value: String(s.id), label: s.name }));
          const departmentOptions = departmentsResponse.data.map((department) => ({ value: department.name, label: department.name }));
          const countryOptions = countriesResponse.data.map((country) => ({ value: country.label, label: country.label }));

          setSuppliers(supplierOptions);
          setCustomers(supplierOptions);
          setDepartments(departmentOptions);
          setCountries(countryOptions);
          setSuppliersLoaded(true);
        })
        .catch(() =>
          showNotification({ title: 'Error', message: 'Failed to load work order dropdown data', color: 'red' })
        );
    }
  }, [opened, suppliersLoaded]);

  useEffect(() => {
    if (opened) {
      setForm(createInitialForm(auth, task));
      setErrors({});
    }
  }, [opened, auth, task]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const updateLineItem = (collection, index, field, value) => {
    setForm((prev) => ({
      ...prev,
      [collection]: prev[collection].map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      )),
    }));
    if (errors[collection]) setErrors((prev) => ({ ...prev, [collection]: null }));
  };

  const addLineItem = (collection, factory) => {
    setForm((prev) => ({ ...prev, [collection]: [...prev[collection], factory()] }));
  };

  const removeLineItem = (collection, index, factory) => {
    setForm((prev) => {
      const nextItems = prev[collection].filter((_, itemIndex) => itemIndex !== index);
      return { ...prev, [collection]: nextItems.length ? nextItems : [factory()] };
    });
  };

  const validate = () => {
    const e = {};
    if (!form.supplier_id) e.supplier_id = 'Please select a supplier.';
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (!String(form.country ?? '').trim()) e.country = 'Please select a country.';
    if (!form.selected_task_ids.length) e.selected_task_ids = 'Select at least one related task.';
    return e;
  };

  const appendIfPresent = (payload, field) => {
    const value = form[field];
    if (value !== null && value !== undefined && value !== '') {
      payload.append(field, value);
    }
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
      WORK_ORDER_FIELDS.forEach((field) => appendIfPresent(payload, field));
      payload.append('labor_items', JSON.stringify(compactLineItems(form.labor_items)));
      payload.append('material_items', JSON.stringify(compactLineItems(form.material_items)));
      form.selected_task_ids.forEach((id) => payload.append('selected_task_ids[]', id));
      form.attachments.forEach((file) => payload.append('attachments[]', file));

      await axios.post(route('tasks.purchase-requests.store', task.id), payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showNotification({
        title: 'Work order sent',
        message: 'The order was emailed to the supplier successfully.',
        color: 'teal',
      });

      setForm(createInitialForm(auth, task));
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
        showNotification({ title: 'Error', message: 'Failed to send work order.', color: 'red' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(createInitialForm(auth, task));
    setErrors({});
    onClose();
  };

  const selectedCountryLabel = (form.country ?? '').toLowerCase();
  const showShipToSection = !selectedCountryLabel || selectedCountryLabel !== 'india';

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Text fw={600} size="md">
          Work Order - {task ? `#${task.number} ${task.name}` : ''}
        </Text>
      }
      size="xl"
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

      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <Stack gap="sm">
            <Text fw={600} size="sm">Email</Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <TextInput label="From" value={auth?.user?.name ?? ''} readOnly disabled />
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
            </SimpleGrid>
            <TextInput
              label="Subject"
              placeholder="Order subject"
              value={form.subject}
              onChange={(e) => updateField('subject', e.target.value)}
              error={errors.subject}
              required
            />
          </Stack>

          <Stack gap="sm">
            <Text fw={600} size="sm">Work Order Details</Text>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
              <TextInput label="Work Order #" value={form.work_order_number} onChange={(e) => updateField('work_order_number', e.target.value)} error={errors.work_order_number} />
              <TextInput label="Work Order Date" type="date" value={form.work_order_date} onChange={(e) => updateField('work_order_date', e.target.value)} error={errors.work_order_date} />
              <Select label="Priority Level" placeholder="Select priority" data={['Low', 'Normal', 'High', 'Urgent']} value={form.priority_level} onChange={(val) => updateField('priority_level', val ?? '')} error={errors.priority_level} clearable />
              <TextInput label="Requested By" value={form.requested_by} onChange={(e) => updateField('requested_by', e.target.value)} error={errors.requested_by} />
              <Select label="Customer" placeholder="Select customer" data={customers} value={form.customer_id} onChange={(val) => updateField('customer_id', val ?? '')} error={errors.customer_id} searchable />
              <Select
                label="Department"
                placeholder="Select department"
                data={departments.length ? departments : DEPARTMENT_OPTIONS.map((option) => ({ value: option, label: option }))}
                value={form.department}
                onChange={(val) => updateField('department', val ?? '')}
                error={errors.department}
                searchable
                clearable
              />
            </SimpleGrid>
          </Stack>

          <Stack gap="sm">
            <Text fw={600} size="sm">Assignment</Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <TextInput label="Work Assigned To" value={form.work_assigned_to} onChange={(e) => updateField('work_assigned_to', e.target.value)} error={errors.work_assigned_to} />
              <TextInput label="Work Completed By" value={form.work_completed_by} onChange={(e) => updateField('work_completed_by', e.target.value)} error={errors.work_completed_by} />
              <TextInput label="Work Expected To Start" type="date" value={form.expected_start_date} onChange={(e) => updateField('expected_start_date', e.target.value)} error={errors.expected_start_date} />
              <TextInput label="Work Expected To Finish" type="date" value={form.expected_finish_date} onChange={(e) => updateField('expected_finish_date', e.target.value)} error={errors.expected_finish_date} />
            </SimpleGrid>
          </Stack>

          <Textarea
            label="Job"
            placeholder="Describe work"
            value={form.job_description}
            onChange={(e) => updateField('job_description', e.target.value)}
            error={errors.job_description}
            rows={3}
          />

          <Stack gap="sm">
            <Text fw={600} size="sm">Billing Address</Text>
            <Select
              label="Country"
              placeholder="Select country"
              data={countries}
              value={form.country}
              onChange={(val) => updateField('country', val ?? '')}
              error={errors.country}
              searchable
              required
              clearable={false}
            />
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              <Stack gap="sm">
                <Text fw={600} size="sm">Bill To</Text>
                <TextInput label="Name" value={form.bill_to_name} onChange={(e) => updateField('bill_to_name', e.target.value)} error={errors.bill_to_name} />
                <TextInput label="Company" value={form.bill_to_company} onChange={(e) => updateField('bill_to_company', e.target.value)} error={errors.bill_to_company} />
                <TextInput label="Street Address" value={form.bill_to_street_address} onChange={(e) => updateField('bill_to_street_address', e.target.value)} error={errors.bill_to_street_address} />
                <TextInput label="City, State, Zip" value={form.bill_to_city_state_zip} onChange={(e) => updateField('bill_to_city_state_zip', e.target.value)} error={errors.bill_to_city_state_zip} />
                <TextInput label="Phone" value={form.bill_to_phone} onChange={(e) => updateField('bill_to_phone', e.target.value)} error={errors.bill_to_phone} />
              </Stack>

              {showShipToSection && (
                <Stack gap="sm">
                  <Text fw={600} size="sm">Ship To</Text>
                  <TextInput label="Name" value={form.ship_to_name} onChange={(e) => updateField('ship_to_name', e.target.value)} error={errors.ship_to_name} />
                  <TextInput label="Company" value={form.ship_to_company} onChange={(e) => updateField('ship_to_company', e.target.value)} error={errors.ship_to_company} />
                  <TextInput label="Street Address" value={form.ship_to_street_address} onChange={(e) => updateField('ship_to_street_address', e.target.value)} error={errors.ship_to_street_address} />
                  <TextInput label="City, State, Zip" value={form.ship_to_city_state_zip} onChange={(e) => updateField('ship_to_city_state_zip', e.target.value)} error={errors.ship_to_city_state_zip} />
                  <TextInput label="Phone" value={form.ship_to_phone} onChange={(e) => updateField('ship_to_phone', e.target.value)} error={errors.ship_to_phone} />
                </Stack>
              )}
            </SimpleGrid>
          </Stack>

          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Text fw={600} size="sm">Labor</Text>
              <Button size="xs" variant="light" onClick={() => addLineItem('labor_items', emptyLaborItem)}>
                Add labor
              </Button>
            </Group>
            <Table withTableBorder withColumnBorders fz="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Description of Work</Table.Th>
                  <Table.Th w={130}>Hours</Table.Th>
                  <Table.Th w={150}>Rate per hour</Table.Th>
                  <Table.Th w={95}></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {form.labor_items.map((item, index) => (
                  <Table.Tr key={index}>
                    <Table.Td><TextInput value={item.description} onChange={(e) => updateLineItem('labor_items', index, 'description', e.target.value)} /></Table.Td>
                    <Table.Td><NumberInput value={item.hours} onChange={(value) => updateLineItem('labor_items', index, 'hours', value ?? '')} min={0} decimalScale={2} /></Table.Td>
                    <Table.Td><NumberInput value={item.rate} onChange={(value) => updateLineItem('labor_items', index, 'rate', value ?? '')} min={0} decimalScale={2} /></Table.Td>
                    <Table.Td><Button size="xs" variant="subtle" color="red" onClick={() => removeLineItem('labor_items', index, emptyLaborItem)}>Remove</Button></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            {errors.labor_items && <Text size="xs" c="red">{errors.labor_items}</Text>}
          </Stack>

          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Text fw={600} size="sm">Materials</Text>
              <Button size="xs" variant="light" onClick={() => addLineItem('material_items', emptyMaterialItem)}>
                Add material
              </Button>
            </Group>
            <Table withTableBorder withColumnBorders fz="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Parts and Material</Table.Th>
                  <Table.Th w={120}>Tax</Table.Th>
                  <Table.Th w={130}>Quantity</Table.Th>
                  <Table.Th w={150}>Unit Price</Table.Th>
                  <Table.Th w={95}></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {form.material_items.map((item, index) => (
                  <Table.Tr key={index}>
                    <Table.Td><TextInput value={item.part} onChange={(e) => updateLineItem('material_items', index, 'part', e.target.value)} /></Table.Td>
                    <Table.Td><NumberInput value={item.tax} onChange={(value) => updateLineItem('material_items', index, 'tax', value ?? '')} min={0} decimalScale={2} /></Table.Td>
                    <Table.Td><NumberInput value={item.quantity} onChange={(value) => updateLineItem('material_items', index, 'quantity', value ?? '')} min={0} decimalScale={2} /></Table.Td>
                    <Table.Td><NumberInput value={item.unit_price} onChange={(value) => updateLineItem('material_items', index, 'unit_price', value ?? '')} min={0} decimalScale={2} /></Table.Td>
                    <Table.Td><Button size="xs" variant="subtle" color="red" onClick={() => removeLineItem('material_items', index, emptyMaterialItem)}>Remove</Button></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            {errors.material_items && <Text size="xs" c="red">{errors.material_items}</Text>}
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            <NumberInput label="S&H Cost" value={form.shipping_handling_cost} onChange={(value) => updateField('shipping_handling_cost', value ?? '')} min={0} decimalScale={2} error={errors.shipping_handling_cost} />
            <TextInput label="Signature" value={form.signature_name} onChange={(e) => updateField('signature_name', e.target.value)} error={errors.signature_name} />
            <TextInput label="Signature Date" type="date" value={form.signature_date} onChange={(e) => updateField('signature_date', e.target.value)} error={errors.signature_date} />
          </SimpleGrid>

          <Textarea label="Additional Info" value={form.additional_info} onChange={(e) => updateField('additional_info', e.target.value)} error={errors.additional_info} rows={3} />
          <Textarea label="Notes (optional)" placeholder="Additional notes to include in the email" value={form.notes} onChange={(e) => updateField('notes', e.target.value)} error={errors.notes} rows={3} />

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
