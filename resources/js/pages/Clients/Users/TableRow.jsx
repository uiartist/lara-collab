import TableRowActions from "@/components/TableRowActions";
import { getInitials } from "@/utils/user";
import { Avatar, Table, Text, Group, Badge } from "@mantine/core";

const levelLabels = {
  "001": "President",
  "002": "Vice President",
  "003": "Supervisor",
  "004": "Manager",
  "005": "Senior Executive",
  "006": "Executive",
  "007": "Coordinator",
  "008": "Assistant",
  "009": "Trainee",
  "010": "Consultant",
};

export default function TableRow({ item, company }) {
  return (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar src={item.avatar} size={40} radius={40} color="blue" alt={item.name}>
            {getInitials(item.name)}
          </Avatar>
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
            <Text fz="xs" c="dimmed">
              {item.job_title}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.code_number ?? "—"}</Text>
      </Table.Td>
      <Table.Td>
        {item.level ? (
          <Badge size="sm" variant="light">
            {levelLabels[item.level] || item.level}
          </Badge>
        ) : (
          <Text fz="sm" c="dimmed">—</Text>
        )}
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.email}</Text>
        <Text fz="xs" c="dimmed">
          Email
        </Text>
      </Table.Td>
      {(can("edit client user") || can("archive client user") || can("restore client user")) && (
        <Table.Td>
          <TableRowActions
            item={item}
            editRoute="clients.companies.users.edit"
            editRouteParams={[company.id]}
            editPermission="edit client user"
            archivePermission="archive client user"
            restorePermission="restore client user"
            archive={{
              route: "clients.companies.users.destroy",
              routeParams: [company.id],
              title: "Archive user",
              content: `Are you sure you want to archive this user? This action will prevent the user from logging in, while all other aspects related to the user's actions will remain unaffected.`,
              confirmLabel: "Archive",
            }}
            restore={{
              route: "clients.companies.users.restore",
              routeParams: [company.id],
              title: "Restore user",
              content: `Are you sure you want to restore this user? This action will allow the user to login.`,
              confirmLabel: "Restore",
            }}
          />
        </Table.Td>
      )}
    </Table.Tr>
  );
}
