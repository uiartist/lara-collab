import TableRowActions from "@/components/TableRowActions";
import { Table, Text } from "@mantine/core";
import { date as formatDate } from "@/utils/datetime";

export default function TableRow({ item }) {
  return (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Text fz="sm" fw={600}>{item.number ?? "-"}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.title ?? "-"}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.subject ?? "-"}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.supplier ?? "-"}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{formatDate(item.created_at)}</Text>
      </Table.Td>
      <Table.Td>
        <TableRowActions
          item={item}
          editRoute="work-orders.edit"
          editPermission="edit purchase request"
          archivePermission="archive purchase request"
          restorePermission="restore purchase request"
          archive={{
            route: "work-orders.destroy",
            title: "Archive work order",
            content: "Are you sure you want to archive this work order?",
            confirmLabel: "Archive",
          }}
          restore={{
            route: "work-orders.restore",
            title: "Restore work order",
            content: "Are you sure you want to restore this work order?",
            confirmLabel: "Restore",
          }}
        />
      </Table.Td>
    </Table.Tr>
  );
}
