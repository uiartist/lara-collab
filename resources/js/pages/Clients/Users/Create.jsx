import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/BackButton";
import useForm from "@/hooks/useForm";
import ContainerBox from "@/layouts/ContainerBox";
import Layout from "@/layouts/MainLayout";
import { redirectTo } from "@/utils/route";
import { getInitials } from "@/utils/user";
import { usePage } from "@inertiajs/react";
import {
  Anchor,
  Avatar,
  Breadcrumbs,
  Divider,
  FileInput,
  Grid,
  Group,
  NumberInput,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";

const customerTypeOptions = ["Corporate", "Individual", "Government", "SME", "Partner"];
const statusOptions = ["Active", "Inactive", "On Hold"];

const buildCountryOptions = (countries = []) => {
  const source = Array.isArray(countries) ? countries : Object.values(countries ?? {});

  const normalizedCountries = source
    .map((country) => {
      if (typeof country === "string") {
        return { value: country, label: country };
      }

      if (country && typeof country === "object") {
        const value = country.value ?? country.id ?? country.name ?? country.label;
        const label = country.label ?? country.name ?? country.value ?? country.id;

        if (!value || !label) {
          return null;
        }

        return { value: String(label), label: String(label) };
      }

      return null;
    })
    .filter(Boolean);

  const options = [{ value: "India", label: "India" }];
  const seen = new Set(["india"]);

  normalizedCountries.forEach((country) => {
    const value = String(country.value ?? "").trim();
    const normalizedValue = value.toLowerCase();

    if (!value || seen.has(normalizedValue)) {
      return;
    }

    seen.add(normalizedValue);
    options.push({ value, label: country.label ?? value });
  });

  return options;
};

const ClientCreate = () => {
  const {
    dropdowns: { countries = [] },
    company,
  } = usePage().props;
  const countryOptions = buildCountryOptions(countries);

  const [form, submit, updateValue] = useForm("post", route("clients.companies.users.store", company.id), {
    avatar: null,
    name: "",
    phone: "",
    customer_type: "",
    status: "Active",
    designation: "",
    mobile_number: "",
    email: "",
    website: "",
    country: "India",
    gst_vat_number: "",
    tax_id_1: "",
    tax_id_2: "",
    payment_terms: "",
    credit_limit: "",
    notes: "",
    password: "",
    password_confirmation: "",
  });

  const normalizedCountry = String(form.data.country ?? "").trim().toLowerCase();
  const isIndianClient = normalizedCountry === "india";

  return (
    <>
      <Breadcrumbs fz={14} mb={30}>
        <Anchor href="#" onClick={() => redirectTo("clients.companies.index")} fz={14}>
          Companies
        </Anchor>
        <Anchor href="#" onClick={() => redirectTo("clients.companies.users.index", company.id)} fz={14}>
          {company.name}
        </Anchor>
        <div>Create User</div>
      </Breadcrumbs>

      <Grid justify="space-between" align="flex-end" gutter="xl" mb="lg">
        <Grid.Col span="auto">
          <Title order={1}>Create user for {company.name}</Title>
        </Grid.Col>
        <Grid.Col span="content"></Grid.Col>
      </Grid>

      <ContainerBox maw={600}>
        <form onSubmit={(e) => submit(e, { forceFormData: true })}>
          <Grid justify="flex-start" align="flex-start" gutter="lg">
            <Grid.Col span="content">
              <Avatar
                src={form.data.avatar !== null ? URL.createObjectURL(form.data.avatar) : null}
                size={120}
                color="blue"
              >
                {getInitials(form.data.name)}
              </Avatar>
            </Grid.Col>
            <Grid.Col span="auto">
              <FileInput
                label="Profile image"
                placeholder="Choose image"
                accept="image/png,image/jpeg"
                onChange={(image) => updateValue("avatar", image)}
                clearable
                error={form.errors.avatar}
              />
              <Text size="xs" c="dimmed" mt="sm">
                If no image is uploaded we will try to fetch it via{" "}
                <Anchor href="https://unavatar.io" target="_blank" opacity={0.6}>
                  unavatar.io
                </Anchor>{" "}
                service.
              </Text>
            </Grid.Col>
          </Grid>

          <TextInput
            label="Name"
            placeholder="User full name"
            required
            mt="md"
            value={form.data.name}
            onChange={(e) => updateValue("name", e.target.value)}
            error={form.errors.name}
          />

          <TextInput
            label="Phone"
            placeholder="Users phone number"
            mt="md"
            value={form.data.phone}
            onChange={(e) => updateValue("phone", e.target.value)}
            error={form.errors.phone}
          />

          <Select
            label="Customer Type"
            placeholder="Select customer type"
            mt="md"
            data={customerTypeOptions}
            value={form.data.customer_type}
            onChange={(value) => updateValue("customer_type", value ?? "")}
            error={form.errors.customer_type}
            clearable
          />

          <Select
            label="Status"
            placeholder="Select status"
            mt="md"
            data={statusOptions}
            value={form.data.status}
            onChange={(value) => updateValue("status", value ?? "Active")}
            error={form.errors.status}
          />

          <TextInput
            label="Designation"
            placeholder="Contact designation"
            mt="md"
            value={form.data.designation}
            onChange={(e) => updateValue("designation", e.target.value)}
            error={form.errors.designation}
          />

          <TextInput
            label="Mobile Number"
            placeholder="Contact mobile number"
            mt="md"
            value={form.data.mobile_number}
            onChange={(e) => updateValue("mobile_number", e.target.value)}
            error={form.errors.mobile_number}
          />

          <TextInput
            label="Website"
            placeholder="https://example.com"
            mt="md"
            value={form.data.website}
            onChange={(e) => updateValue("website", e.target.value)}
            error={form.errors.website}
          />

          <Select
            label="Country"
            placeholder="Select country"
            mt="md"
            data={countryOptions}
            value={form.data.country}
            onChange={(value) => updateValue("country", value ?? "India")}
            error={form.errors.country}
            searchable
            clearable={false}
          />

          {isIndianClient ? (
            <TextInput
              label="GST / VAT Number"
              placeholder="GST / VAT number"
              mt="md"
              value={form.data.gst_vat_number}
              onChange={(e) => updateValue("gst_vat_number", e.target.value)}
              error={form.errors.gst_vat_number}
            />
          ) : (
            <>
              <TextInput
                label="Tax ID 1"
                placeholder="Primary tax identifier"
                mt="md"
                value={form.data.tax_id_1}
                onChange={(e) => updateValue("tax_id_1", e.target.value)}
                error={form.errors.tax_id_1}
              />
              <TextInput
                label="Tax ID 2"
                placeholder="Secondary tax identifier"
                mt="md"
                value={form.data.tax_id_2}
                onChange={(e) => updateValue("tax_id_2", e.target.value)}
                error={form.errors.tax_id_2}
              />
            </>
          )}

          <TextInput
            label="Payment Terms"
            placeholder="Net 30"
            mt="md"
            value={form.data.payment_terms}
            onChange={(e) => updateValue("payment_terms", e.target.value)}
            error={form.errors.payment_terms}
          />

          <NumberInput
            label="Credit Limit"
            placeholder="50000"
            mt="md"
            value={form.data.credit_limit}
            onChange={(value) => updateValue("credit_limit", value ?? "")}
            min={0}
            decimalScale={2}
            error={form.errors.credit_limit}
          />

          <Textarea
            label="Notes"
            placeholder="Additional user notes"
            mt="md"
            rows={3}
            value={form.data.notes}
            onChange={(e) => updateValue("notes", e.target.value)}
            error={form.errors.notes}
          />

          <Divider mt="xl" mb="md" label="Login credentials" labelPosition="center" />

          <TextInput
            label="Email"
            placeholder="User email"
            required
            value={form.data.email}
            onChange={(e) => updateValue("email", e.target.value)}
            onBlur={() => form.validate("email")}
            error={form.errors.email}
          />

          <PasswordInput
            label="Password"
            placeholder="User password"
            required
            mt="md"
            value={form.data.password}
            onChange={(e) => updateValue("password", e.target.value)}
            error={form.errors.password}
          />

          <PasswordInput
            label="Confirm password"
            placeholder="Confirm password"
            required
            mt="md"
            value={form.data.password_confirmation}
            onChange={(e) => updateValue("password_confirmation", e.target.value)}
            error={form.errors.password_confirmation}
          />

          <Group justify="space-between" mt="xl">
            <BackButton route="clients.companies.users.index" params={company.id} />
            <ActionButton loading={form.processing}>Create</ActionButton>
          </Group>
        </form>
      </ContainerBox>
    </>
  );
};

ClientCreate.layout = (page) => <Layout title="Create User">{page}</Layout>;

export default ClientCreate;
