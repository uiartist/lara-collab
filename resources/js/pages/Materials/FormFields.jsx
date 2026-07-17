import { Checkbox, Grid, NumberInput, Select, TextInput, Textarea, Title } from "@mantine/core";

const materialStatusOptions = ["Active", "Inactive"];
const materialTypeOptions = ["Raw Material", "Consumable", "Asset", "Finished Goods"];
const categoryOptions = [
  "Cement",
  "Steel",
  "Sand",
  "Aggregates",
  "Bricks & Blocks",
  "Concrete",
  "Electrical Materials",
  "Plumbing Materials",
  "Paints & Chemicals",
  "Tiles & Flooring",
  "Hardware & Fasteners",
  "Safety Equipment",
  "Machinery Spare Parts",
];
const uomOptions = ["Nos", "Kg", "Ton", "Bag", "Ltr", "Mtr", "Sqft", "Cum"];
const currencyOptions = ["INR", "USD", "EUR", "GBP", "AED"];

export default function FormFields({ form, updateValue, suppliers }) {
  return (
    <Grid gutter="lg">
      <Grid.Col span={12}>
        <Title order={3}>Material Basic Information</Title>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput label="Material Code" required value={form.data.material_code} onChange={(e) => updateValue("material_code", e.target.value)} error={form.errors.material_code} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput label="Material Name" required value={form.data.material_name} onChange={(e) => updateValue("material_name", e.target.value)} error={form.errors.material_name} />
      </Grid.Col>
      <Grid.Col span={12}>
        <Textarea label="Material Description" rows={3} value={form.data.material_description} onChange={(e) => updateValue("material_description", e.target.value)} error={form.errors.material_description} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select label="Material Category" required data={categoryOptions} value={form.data.material_category} onChange={(value) => updateValue("material_category", value ?? "")} error={form.errors.material_category} searchable />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput label="Material Sub-Category" value={form.data.material_sub_category} onChange={(e) => updateValue("material_sub_category", e.target.value)} error={form.errors.material_sub_category} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select label="Material Type" data={materialTypeOptions} value={form.data.material_type} onChange={(value) => updateValue("material_type", value ?? "")} error={form.errors.material_type} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select label="Material Status" required data={materialStatusOptions} value={form.data.material_status} onChange={(value) => updateValue("material_status", value ?? "Active")} error={form.errors.material_status} />
      </Grid.Col>

      <Grid.Col span={12}>
        <Title order={3}>Unit, Inventory & Procurement</Title>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Select label="UOM" required data={uomOptions} value={form.data.uom} onChange={(value) => updateValue("uom", value ?? "")} error={form.errors.uom} searchable />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <TextInput label="HSN/SAC Code" required value={form.data.hsn_sac_code} onChange={(e) => updateValue("hsn_sac_code", e.target.value)} error={form.errors.hsn_sac_code} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <NumberInput label="GST %" min={0} decimalScale={2} value={form.data.gst_rate} onChange={(value) => updateValue("gst_rate", value ?? "")} error={form.errors.gst_rate} />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <Select label="Preferred Supplier" data={suppliers} value={form.data.preferred_supplier_id} onChange={(value) => updateValue("preferred_supplier_id", value ?? "")} error={form.errors.preferred_supplier_id} searchable clearable />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <TextInput label="Supplier Material Code" value={form.data.supplier_material_code} onChange={(e) => updateValue("supplier_material_code", e.target.value)} error={form.errors.supplier_material_code} />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <NumberInput label="Purchase Rate" min={0} decimalScale={2} value={form.data.purchase_rate} onChange={(value) => updateValue("purchase_rate", value ?? "")} error={form.errors.purchase_rate} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <NumberInput label="Current Stock" min={0} decimalScale={2} value={form.data.current_stock} onChange={(value) => updateValue("current_stock", value ?? "")} error={form.errors.current_stock} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <NumberInput label="Reorder Level" min={0} decimalScale={2} value={form.data.reorder_level} onChange={(value) => updateValue("reorder_level", value ?? "")} error={form.errors.reorder_level} />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <TextInput label="Warehouse" required value={form.data.warehouse} onChange={(e) => updateValue("warehouse", e.target.value)} error={form.errors.warehouse} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <TextInput label="Project Allocation" required value={form.data.project_allocation} onChange={(e) => updateValue("project_allocation", e.target.value)} error={form.errors.project_allocation} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Select label="Currency" data={currencyOptions} value={form.data.currency} onChange={(value) => updateValue("currency", value ?? "")} error={form.errors.currency} searchable clearable />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <Checkbox mt={30} label="Quality Inspection Required" checked={Boolean(form.data.quality_inspection_required)} onChange={(event) => updateValue("quality_inspection_required", event.currentTarget.checked)} />
      </Grid.Col>

      <Grid.Col span={12}>
        <Textarea
          label="Material Specification"
          rows={4}
          value={form.data.technical_specifications}
          onChange={(e) => updateValue("technical_specifications", e.target.value)}
          error={form.errors.technical_specifications}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <NumberInput label="Lead Time (Days)" min={0} value={form.data.lead_time_days} onChange={(value) => updateValue("lead_time_days", value ?? "")} error={form.errors.lead_time_days} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <NumberInput label="MOQ" min={0} decimalScale={2} value={form.data.minimum_order_quantity} onChange={(value) => updateValue("minimum_order_quantity", value ?? "")} error={form.errors.minimum_order_quantity} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Checkbox mt={30} label="Stock Item" checked={Boolean(form.data.stock_item)} onChange={(event) => updateValue("stock_item", event.currentTarget.checked)} />
      </Grid.Col>
    </Grid>
  );
}
