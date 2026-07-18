import ArchivedFilterButton from "@/components/ArchivedFilterButton";
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import TableHead from "@/components/TableHead";
import TableRowEmpty from "@/components/TableRowEmpty";
import Layout from "@/layouts/MainLayout";
import { redirectTo, reloadWithQuery } from "@/utils/route";
import { actionColumnVisibility, prepareColumns } from "@/utils/table";
import { usePage } from "@inertiajs/react";
import { Anchor, Button, Grid, Group, Table } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import TableRow from "./TableRow";

const ClientsIndex = () => {
  const { items, company } = usePage().props;

  const columns = prepareColumns([
    { label: "User", column: "name" },
    { label: "Code Number", column: "code_number" },
    { label: "Email", column: "email" },
    {
      label: "Actions",
      sortable: false,
      visible: actionColumnVisibility("client user"),
    },
  ]);

  const rows = items.data.length ? (
    items.data.map((item) => <TableRow item={item} company={company} key={item.id} />)
  ) : (
    <TableRowEmpty colSpan={columns.length} />
  );

  const search = (search) => reloadWithQuery({ search });
  const sort = (sort) => reloadWithQuery(sort);

  return (
    <>
      <Grid justify="space-between" align="center" mb="lg">
        <Grid.Col span="auto">
          <Group gap="xs">
            <Anchor href={route("clients.companies.index")} underline="hover">
              Companies
            </Anchor>
            <span>/</span>
            <span>{company.name}</span>
          </Group>
        </Grid.Col>
      </Grid>

      <Grid justify="space-between" align="center">
        <Grid.Col span="content">
          <Group>
            <SearchInput placeholder="Search users" search={search} />
            <ArchivedFilterButton />
          </Group>
        </Grid.Col>
        <Grid.Col span="content">
          {can("create client user") && (
            <Button
              leftSection={<IconPlus size={14} />}
              radius="xl"
              onClick={() => redirectTo("clients.companies.users.create", [company.id])}
            >
              Create
            </Button>
          )}
        </Grid.Col>
      </Grid>

      <Table.ScrollContainer miw={800} my="lg">
        <Table verticalSpacing="sm">
          <TableHead columns={columns} sort={sort} />
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Pagination current={items.meta.current_page} pages={items.meta.last_page} />
    </>
  );
};

ClientsIndex.layout = (page) => <Layout title="Company Users">{page}</Layout>;

export default ClientsIndex;
