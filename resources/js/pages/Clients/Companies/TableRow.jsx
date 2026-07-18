import TableRowActions from '@/components/TableRowActions';
import { Link } from '@inertiajs/react';
import { Badge, Group, Table, Text } from '@mantine/core';

export default function TableRow({ item }) {
  return (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Text
          fz='sm'
          fw={500}
        >
          {item.name}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fz='sm'>{item.email}</Text>
        <Text
          fz='xs'
          c='dimmed'
        >
          Email
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fz='sm'>{item.code_number ?? '—'}</Text>
        <Text
          fz='xs'
          c='dimmed'
        >
          Code
        </Text>
      </Table.Td>
      <Table.Td>
        <Link href={route('clients.companies.users.index', item.id)} style={{ textDecoration: 'none' }}>
          <Badge
            variant='light'
            color='blue'
            style={{ cursor: 'pointer' }}
          >
            {item.users_count} user{item.users_count !== 1 ? 's' : ''}
          </Badge>
        </Link>
      </Table.Td>
      {(can('edit client company') ||
        can('archive client company') ||
        can('restore client company')) && (
        <Table.Td>
          <TableRowActions
            item={item}
            editRoute='clients.companies.edit'
            editPermission='edit client company'
            archivePermission='archive client company'
            restorePermission='restore client company'
            archive={{
              route: 'clients.companies.destroy',
              title: 'Archive company',
              content: `Are you sure you want to archive this company?`,
              confirmLabel: 'Archive',
            }}
            restore={{
              route: 'clients.companies.restore',
              title: 'Restore company',
              content: `Are you sure you want to restore this company?`,
              confirmLabel: 'Restore',
            }}
          />
        </Table.Td>
      )}
    </Table.Tr>
  );
}
