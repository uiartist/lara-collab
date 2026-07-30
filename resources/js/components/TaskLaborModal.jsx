import { Button, FileInput, Group, Modal, Select, Stack, Text, Textarea } from '@mantine/core';
import { useEffect, useState } from 'react';

export default function TaskLaborModal({ opened, onClose, task, users = [] }) {
  const [selectedUser, setSelectedUser] = useState('');
  const [timesheetFile, setTimesheetFile] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (opened) {
      setSelectedUser(task?.assigned_to_user_id?.toString() || '');
      setTimesheetFile(null);
      setNotes('');
    }
  }, [opened, task]);

  const userOptions = users.map(user => ({
    value: user.id.toString(),
    label: user.name,
  }));

  return (
    <Modal opened={opened} onClose={onClose} title={`Labor for #${task?.number || ''}`} size='md'>
      <Stack spacing='md'>
        <Text size='sm' color='dimmed'>Select the user who has access to this project. This controls labor assignment for the task.</Text>

        <Select
          label='Project users'
          placeholder='Select a user'
          searchable
          value={selectedUser}
          onChange={setSelectedUser}
          data={userOptions}
        />

        <FileInput
          label='Upload timesheet'
          placeholder='Attach timesheet file'
          accept='.xls,.xlsx,.csv'
          value={timesheetFile}
          onChange={setTimesheetFile}
          clearable
        />

        <Textarea
          label='Notes'
          placeholder='Optional labor notes'
          value={notes}
          onChange={event => setNotes(event.currentTarget.value)}
          minRows={3}
        />

        <Group position='right'>
          <Button variant='outline' onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Save</Button>
        </Group>
      </Stack>
    </Modal>
  );
}
