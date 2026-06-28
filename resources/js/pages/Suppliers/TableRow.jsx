import TableRowActions from "@/components/TableRowActions";
import { Table, Text } from "@mantine/core";

export default function TableRow({ item }) {
  return (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Text fz="sm">{item.id}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.code_number ?? "—"}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm" fw={500}>{item.name}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.email ?? "—"}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.phone ?? "—"}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.contact_person ?? "—"}</Text>
      </Table.Td>
      {(can("edit supplier") || can("archive supplier") || can("restore supplier")) && (
        <Table.Td>
          <TableRowActions
            item={item}
            editRoute="suppliers.edit"
            editPermission="edit supplier"
            archivePermission="archive supplier"
            restorePermission="restore supplier"
            archive={{
              route: "suppliers.destroy",
              title: "Archive supplier",
              content: "Are you sure you want to archive this supplier?",
              confirmLabel: "Archive",
            }}
            restore={{
              route: "suppliers.restore",
              title: "Restore supplier",
              content: "Are you sure you want to restore this supplier?",
              confirmLabel: "Restore",
            }}
          />
        </Table.Td>
      )}
    </Table.Tr>
  );
}
