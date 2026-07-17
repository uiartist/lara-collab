import TableRowActions from "@/components/TableRowActions";
import { Badge, Table, Text } from "@mantine/core";

export default function TableRow({ item }) {
  return (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Text fz="sm" fw={600}>{item.material_code}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.material_name}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.material_category ?? "-"}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.uom ?? "-"}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.current_stock ?? "0"}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.warehouse ?? "-"}</Text>
      </Table.Td>
      <Table.Td>
        <Badge color={item.material_status === "Active" ? "teal" : "gray"} variant="light" tt="unset">
          {item.material_status ?? "Inactive"}
        </Badge>
      </Table.Td>
      {(can("edit material") || can("archive material") || can("restore material")) && (
        <Table.Td>
          <TableRowActions
            item={item}
            editRoute="materials.edit"
            editPermission="edit material"
            archivePermission="archive material"
            restorePermission="restore material"
            archive={{
              route: "materials.destroy",
              title: "Archive material",
              content: "Are you sure you want to archive this material?",
              confirmLabel: "Archive",
            }}
            restore={{
              route: "materials.restore",
              title: "Restore material",
              content: "Are you sure you want to restore this material?",
              confirmLabel: "Restore",
            }}
          />
        </Table.Td>
      )}
    </Table.Tr>
  );
}
