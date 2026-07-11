import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/BackButton";
import useForm from "@/hooks/useForm";
import ContainerBox from "@/layouts/ContainerBox";
import Layout from "@/layouts/MainLayout";
import { redirectTo } from "@/utils/route";
import { usePage } from "@inertiajs/react";
import { Anchor, Breadcrumbs, Checkbox, Grid, Group, NumberInput, Select, TextInput, Textarea, Title } from "@mantine/core";

const supplierTypeOptions = ["Contractor", "Material Supplier", "Equipment Vendor", "Service Provider"];
const statusOptions = ["Active", "Inactive", "Blacklisted"];
const gstRegistrationTypeOptions = ["Regular", "Composition", "Exempt", "Unregistered"];
const currencyOptions = ["INR", "USD", "EUR", "GBP", "AED"];

const SupplierCreate = () => {
  const { countries = [] } = usePage().props;

  const [form, submit, updateValue] = useForm("post", route("suppliers.store"), {
    code_number: "",
    vendor_code: "",
    name: "",
    legal_entity_name: "",
    supplier_type: "",
    supplier_category: "",
    status: "Active",
    gst_registration_type: "",
    contact_person: "",
    contact_person_name: "",
    designation: "",
    mobile_number: "",
    email: "",
    website: "",
    alternate_contact_details: "",
    phone: "",
    address: "",
    registered_address: "",
    billing_address: "",
    dispatch_address: "",
    city: "",
    state: "",
    country: "India",
    postal_code: "",
    gst_number: "",
    pan_number: "",
    tan_number: "",
    msme_registration_number: "",
    cin_number: "",
    trade_license_number: "",
    compliance_certificates: "",
    insurance_details: "",
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    swift_code: "",
    branch_name: "",
    upi_id: "",
    material_categories_supplied: "",
    preferred_supplier: false,
    lead_time_days: "",
    minimum_order_quantity: "",
    delivery_terms: "",
    payment_terms: "",
    credit_limit: "",
    currency: "",
    tax_id_1: "",
    tax_id_2: "",
  });

  const isIndianSupplier = (form.data.country ?? "").toLowerCase() === "india";

  return (
    <>
      <Breadcrumbs fz={14} mb={30}>
        <Anchor href="#" onClick={() => redirectTo("suppliers.index")} fz={14}>
          Suppliers
        </Anchor>
        <div>Create</div>
      </Breadcrumbs>

      <Grid justify="space-between" align="flex-end" gutter="xl" mb="lg">
        <Grid.Col span="auto">
          <Title order={1}>Create supplier</Title>
        </Grid.Col>
      </Grid>

      <ContainerBox maw={1100}>
        <form onSubmit={submit}>
          <Grid gutter="lg">
            <Grid.Col span={12}>
              <Title order={3}>Supplier basic information</Title>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Supplier ID / Vendor Code" value={form.data.code_number} readOnly />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Vendor Code" placeholder="V-1001" value={form.data.vendor_code} onChange={(e) => updateValue("vendor_code", e.target.value)} error={form.errors.vendor_code} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Supplier Name" placeholder="Supplier name" value={form.data.name} onChange={(e) => updateValue("name", e.target.value)} error={form.errors.name} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Legal Entity Name" placeholder="Legal entity name" value={form.data.legal_entity_name} onChange={(e) => updateValue("legal_entity_name", e.target.value)} error={form.errors.legal_entity_name} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select label="Supplier Type" placeholder="Select supplier type" data={supplierTypeOptions} value={form.data.supplier_type} onChange={(value) => updateValue("supplier_type", value ?? "")} error={form.errors.supplier_type} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Supplier Category" placeholder="Supplier category" value={form.data.supplier_category} onChange={(e) => updateValue("supplier_category", e.target.value)} error={form.errors.supplier_category} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select label="Status" placeholder="Select status" data={statusOptions} value={form.data.status} onChange={(value) => updateValue("status", value ?? "Active")} error={form.errors.status} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select label="GST Registration Type" placeholder="Select GST type" data={gstRegistrationTypeOptions} value={form.data.gst_registration_type} onChange={(value) => updateValue("gst_registration_type", value ?? "")} error={form.errors.gst_registration_type} />
            </Grid.Col>

            <Grid.Col span={12}>
              <Title order={3}>Contact information</Title>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Contact Person Name" placeholder="Contact person name" value={form.data.contact_person_name} onChange={(e) => updateValue("contact_person_name", e.target.value)} error={form.errors.contact_person_name} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Designation" placeholder="Designation" value={form.data.designation} onChange={(e) => updateValue("designation", e.target.value)} error={form.errors.designation} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Mobile Number" placeholder="+91 9876543210" value={form.data.mobile_number} onChange={(e) => updateValue("mobile_number", e.target.value)} error={form.errors.mobile_number} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Email Address" placeholder="supplier@example.com" value={form.data.email} onChange={(e) => updateValue("email", e.target.value)} error={form.errors.email} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Website" placeholder="https://example.com" value={form.data.website} onChange={(e) => updateValue("website", e.target.value)} error={form.errors.website} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Alternate Contact Details" placeholder="Alternate contact details" value={form.data.alternate_contact_details} onChange={(e) => updateValue("alternate_contact_details", e.target.value)} error={form.errors.alternate_contact_details} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Phone" placeholder="+1 234 567 890" value={form.data.phone} onChange={(e) => updateValue("phone", e.target.value)} error={form.errors.phone} />
            </Grid.Col>

            <Grid.Col span={12}>
              <Title order={3}>Address details</Title>
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea label="Registered Address" placeholder="Registered address" value={form.data.registered_address} onChange={(e) => updateValue("registered_address", e.target.value)} error={form.errors.registered_address} rows={3} />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea label="Billing Address" placeholder="Billing address" value={form.data.billing_address} onChange={(e) => updateValue("billing_address", e.target.value)} error={form.errors.billing_address} rows={3} />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea label="Dispatch Address" placeholder="Dispatch address" value={form.data.dispatch_address} onChange={(e) => updateValue("dispatch_address", e.target.value)} error={form.errors.dispatch_address} rows={3} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="City" placeholder="City" value={form.data.city} onChange={(e) => updateValue("city", e.target.value)} error={form.errors.city} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="State" placeholder="State" value={form.data.state} onChange={(e) => updateValue("state", e.target.value)} error={form.errors.state} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Country"
                placeholder="Select country"
                data={countries}
                value={form.data.country}
                onChange={(value) => updateValue("country", value ?? "")}
                error={form.errors.country}
                searchable
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Postal Code" placeholder="Postal code" value={form.data.postal_code} onChange={(e) => updateValue("postal_code", e.target.value)} error={form.errors.postal_code} />
            </Grid.Col>

            <Grid.Col span={12}>
              <Title order={3}>Tax & compliance</Title>
            </Grid.Col>
            {isIndianSupplier ? (
              <>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput label="GST Number" placeholder="GST number" value={form.data.gst_number} onChange={(e) => updateValue("gst_number", e.target.value)} error={form.errors.gst_number} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput label="PAN Number" placeholder="PAN number" value={form.data.pan_number} onChange={(e) => updateValue("pan_number", e.target.value)} error={form.errors.pan_number} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput label="TAN Number" placeholder="TAN number" value={form.data.tan_number} onChange={(e) => updateValue("tan_number", e.target.value)} error={form.errors.tan_number} />
                </Grid.Col>
              </>
            ) : (
              <>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput label="Tax ID 1" placeholder="Tax ID 1" value={form.data.tax_id_1} onChange={(e) => updateValue("tax_id_1", e.target.value)} error={form.errors.tax_id_1} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput label="Tax ID 2" placeholder="Tax ID 2" value={form.data.tax_id_2} onChange={(e) => updateValue("tax_id_2", e.target.value)} error={form.errors.tax_id_2} />
                </Grid.Col>
              </>
            )}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="MSME Registration Number" placeholder="MSME number" value={form.data.msme_registration_number} onChange={(e) => updateValue("msme_registration_number", e.target.value)} error={form.errors.msme_registration_number} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="CIN Number" placeholder="CIN number" value={form.data.cin_number} onChange={(e) => updateValue("cin_number", e.target.value)} error={form.errors.cin_number} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Trade License Number" placeholder="Trade license number" value={form.data.trade_license_number} onChange={(e) => updateValue("trade_license_number", e.target.value)} error={form.errors.trade_license_number} />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea label="Compliance Certificates" placeholder="Compliance certificates" value={form.data.compliance_certificates} onChange={(e) => updateValue("compliance_certificates", e.target.value)} error={form.errors.compliance_certificates} rows={3} />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea label="Insurance Details" placeholder="Insurance details" value={form.data.insurance_details} onChange={(e) => updateValue("insurance_details", e.target.value)} error={form.errors.insurance_details} rows={3} />
            </Grid.Col>

            <Grid.Col span={12}>
              <Title order={3}>Banking information</Title>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Bank Name" placeholder="Bank name" value={form.data.bank_name} onChange={(e) => updateValue("bank_name", e.target.value)} error={form.errors.bank_name} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Account Holder Name" placeholder="Account holder name" value={form.data.account_holder_name} onChange={(e) => updateValue("account_holder_name", e.target.value)} error={form.errors.account_holder_name} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Account Number" placeholder="Account number" value={form.data.account_number} onChange={(e) => updateValue("account_number", e.target.value)} error={form.errors.account_number} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="IFSC Code" placeholder="IFSC code" value={form.data.ifsc_code} onChange={(e) => updateValue("ifsc_code", e.target.value)} error={form.errors.ifsc_code} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="SWIFT Code" placeholder="SWIFT code" value={form.data.swift_code} onChange={(e) => updateValue("swift_code", e.target.value)} error={form.errors.swift_code} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Branch Name" placeholder="Branch name" value={form.data.branch_name} onChange={(e) => updateValue("branch_name", e.target.value)} error={form.errors.branch_name} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="UPI ID (Optional)" placeholder="supplier@upi" value={form.data.upi_id} onChange={(e) => updateValue("upi_id", e.target.value)} error={form.errors.upi_id} />
            </Grid.Col>

            <Grid.Col span={12}>
              <Title order={3}>Procurement details</Title>
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput label="Material Categories Supplied" placeholder="Steel, Cement" value={form.data.material_categories_supplied} onChange={(e) => updateValue("material_categories_supplied", e.target.value)} error={form.errors.material_categories_supplied} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Checkbox label="Preferred Supplier" checked={form.data.preferred_supplier} onChange={(event) => updateValue("preferred_supplier", event.currentTarget.checked)} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput label="Lead Time (Days)" placeholder="10" value={form.data.lead_time_days} onChange={(value) => updateValue("lead_time_days", value ?? "")} error={form.errors.lead_time_days} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput label="Minimum Order Quantity (MOQ)" placeholder="100" value={form.data.minimum_order_quantity} onChange={(value) => updateValue("minimum_order_quantity", value ?? "")} error={form.errors.minimum_order_quantity} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Delivery Terms" placeholder="FOB" value={form.data.delivery_terms} onChange={(e) => updateValue("delivery_terms", e.target.value)} error={form.errors.delivery_terms} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput label="Payment Terms" placeholder="Net 30" value={form.data.payment_terms} onChange={(e) => updateValue("payment_terms", e.target.value)} error={form.errors.payment_terms} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput label="Credit Limit" placeholder="500000" value={form.data.credit_limit} onChange={(value) => updateValue("credit_limit", value ?? "")} error={form.errors.credit_limit} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select label="Currency" placeholder="Select currency" data={currencyOptions} value={form.data.currency} onChange={(value) => updateValue("currency", value ?? "")} error={form.errors.currency} />
            </Grid.Col>

            <Grid.Col span={12}>
              <Group justify="flex-end">
                <BackButton onClick={() => redirectTo("suppliers.index")} />
                <ActionButton loading={form.processing}>Create</ActionButton>
              </Group>
            </Grid.Col>
          </Grid>
        </form>
      </ContainerBox>
    </>
  );
};

SupplierCreate.layout = (page) => <Layout title="Create Supplier">{page}</Layout>;

export default SupplierCreate;
