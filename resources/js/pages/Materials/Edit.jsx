import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/BackButton";
import useForm from "@/hooks/useForm";
import ContainerBox from "@/layouts/ContainerBox";
import Layout from "@/layouts/MainLayout";
import { redirectTo } from "@/utils/route";
import { usePage } from "@inertiajs/react";
import { Anchor, Breadcrumbs, Group, Title } from "@mantine/core";
import FormFields from "./FormFields";

const EditMaterial = () => {
  const { item, suppliers = [] } = usePage().props;

  const [form, submit, updateValue] = useForm("put", route("materials.update", item.id), {
    material_code: item.material_code ?? "",
    material_name: item.material_name ?? "",
    material_description: item.material_description ?? "",
    material_category: item.material_category ?? "",
    material_sub_category: item.material_sub_category ?? "",
    material_type: item.material_type ?? "",
    brand: item.brand ?? "",
    manufacturer: item.manufacturer ?? "",
    material_status: item.material_status ?? "Active",
    uom: item.uom ?? "",
    alternate_uom: item.alternate_uom ?? "",
    conversion_factor: item.conversion_factor ?? "",
    stock_item: Boolean(item.stock_item),
    current_stock: item.current_stock ?? 0,
    reorder_level: item.reorder_level ?? "",
    warehouse: item.warehouse ?? "",
    preferred_supplier_id: item.preferred_supplier_id ?? "",
    supplier_material_code: item.supplier_material_code ?? "",
    lead_time_days: item.lead_time_days ?? "",
    minimum_order_quantity: item.minimum_order_quantity ?? "",
    purchase_rate: item.purchase_rate ?? "",
    currency: item.currency ?? "",
    gst_rate: item.gst_rate ?? "",
    hsn_sac_code: item.hsn_sac_code ?? "",
    project_allocation: item.project_allocation ?? "",
    quality_inspection_required: Boolean(item.quality_inspection_required),
    technical_specifications: item.technical_specifications ?? "",
  });

  return (
    <>
      <Breadcrumbs fz={14} mb={30}>
        <Anchor href="#" onClick={() => redirectTo("materials.index")} fz={14}>
          Materials
        </Anchor>
        <div>Edit</div>
      </Breadcrumbs>

      <Title order={1} mb="lg">Edit material</Title>

      <ContainerBox maw={1100}>
        <form onSubmit={submit}>
          <FormFields form={form} updateValue={updateValue} suppliers={suppliers} />

          <Group justify="space-between" mt="xl">
            <BackButton onClick={() => redirectTo("materials.index")} />
            <ActionButton loading={form.processing}>Update</ActionButton>
          </Group>
        </form>
      </ContainerBox>
    </>
  );
};

EditMaterial.layout = (page) => <Layout title="Edit material">{page}</Layout>;

export default EditMaterial;
