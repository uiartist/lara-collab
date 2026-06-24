import { redirectTo } from "@/utils/route";
import { ActionIcon, Group, Table, Text, rem } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useForm } from "laravel-precognition-react-inertia";
import { openConfirmModal } from "@/components/ConfirmModal";

export default function TableRow({ item }) {
  const deleteForm = useForm("delete", route("settings.code-numbers.destroy", item.id));

  const openDeleteModal = () =>
    openConfirmModal({
      type: "danger",
      title: "Delete entity code number",
      content: "Are you sure you want to delete this entity code number?",
      confirmLabel: "Delete",
      confirmProps: { color: "red" },
      onConfirm: () => deleteForm.submit(),
    });

  return (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Text fz="sm">{item.entity_type}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.code_number}</Text>
      </Table.Td>
      <Table.Td w={100}>
        <Group gap={0} justify="flex-end" wrap="nowrap">
          {can("edit code number") && (
            <ActionIcon variant="subtle" color="blue" onClick={() => redirectTo("settings.code-numbers.edit", item.id)}>
              <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
          )}
          {can("delete code number") && (
            <ActionIcon variant="subtle" color="red" onClick={openDeleteModal}>
              <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}
