import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/BackButton";
import useForm from "@/hooks/useForm";
import ContainerBox from "@/layouts/ContainerBox";
import Layout from "@/layouts/MainLayout";
import { redirectTo } from "@/utils/route";
import { usePage } from "@inertiajs/react";
import { Anchor, Breadcrumbs, Group, Title } from "@mantine/core";
import FormFields from "./FormFields";

const CreateMaterial = () => {
  const { suppliers = [] } = usePage().props;

  const [form, submit, updateValue] = useForm("post", route("materials.store"), {
    material_code: "",
    material_name: "",
    material_description: "",
    material_category: "",
    material_sub_category: "",
    material_type: "",
    brand: "",
    manufacturer: "",
    material_status: "Active",
    uom: "",
    alternate_uom: "",
    conversion_factor: "",
    stock_item: true,
    current_stock: 0,
    reorder_level: "",
    warehouse: "",
    preferred_supplier_id: "",
    supplier_material_code: "",
    lead_time_days: "",
    minimum_order_quantity: "",
    purchase_rate: "",
    currency: "",
    gst_rate: "",
    hsn_sac_code: "",
    project_allocation: "",
    quality_inspection_required: false,
    technical_specifications: "",
  });

  return (
    <>
      <Breadcrumbs fz={14} mb={30}>
        <Anchor href="#" onClick={() => redirectTo("materials.index")} fz={14}>
          Materials
        </Anchor>
        <div>Create</div>
      </Breadcrumbs>

      <Title order={1} mb="lg">Create material</Title>

      <ContainerBox maw={1100}>
        <form onSubmit={submit}>
          <FormFields form={form} updateValue={updateValue} suppliers={suppliers} />

          <Group justify="space-between" mt="xl">
            <BackButton onClick={() => redirectTo("materials.index")} />
            <ActionButton loading={form.processing}>Create</ActionButton>
          </Group>
        </form>
      </ContainerBox>
    </>
  );
};

CreateMaterial.layout = (page) => <Layout title="Create material">{page}</Layout>;

export default CreateMaterial;
