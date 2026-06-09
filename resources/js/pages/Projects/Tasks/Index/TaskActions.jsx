import { openConfirmModal } from "@/components/ConfirmModal";
import { ActionIcon, Group, Menu, rem } from "@mantine/core";
import { IconArchive, IconArchiveOff, IconDots } from "@tabler/icons-react";
import { useState } from 'react';
import { usePage } from "@inertiajs/react";
import TaskCostsModal from '@/components/TaskCostsModal';
import { useForm } from "laravel-precognition-react-inertia";

export default function TaskActions({ task, ...props }) {
  const [costsOpened, setCostsOpened] = useState(false);
  const { currency } = usePage().props;
  const archiveForm = useForm(
    "delete",
    route("projects.tasks.destroy", [task.project_id, task.id]),
  );
  const restoreForm = useForm("post", route("projects.tasks.restore", [task.project_id, task.id]));

  const openArchiveModal = () =>
    openConfirmModal({
      type: "danger",
      title: "Archive task",
      content: `Are you sure you want to archive this task?`,
      confirmLabel: "Archive",
      confirmProps: { color: "red" },
      onConfirm: () => archiveForm.submit({ preserveScroll: true }),
    });

  const openRestoreModal = () =>
    openConfirmModal({
      type: "info",
      title: "Restore task",
      content: `Are you sure you want to restore this task?`,
      confirmLabel: "Restore",
      confirmProps: { color: "blue" },
      onConfirm: () => restoreForm.submit({ preserveScroll: true }),
    });

  return (
    <Group gap={0} justify="flex-end" {...props}>
      <ActionIcon
        title={`Costs (${currency?.symbol ?? ''})`}
        variant="subtle"
        onClick={() => setCostsOpened(true)}
      >
        <span style={{ fontSize: rem(14) }}>{currency?.symbol ?? '$'}</span>
      </ActionIcon>
      <TaskCostsModal opened={costsOpened} onClose={() => setCostsOpened(false)} projectId={task.project_id} task={task} />
      {((can("archive task") && !route().params.archived) ||
        (can("restore task") && route().params.archived)) && (
        <Menu
          withArrow
          position="bottom-end"
          withinPortal
          shadow="md"
          transitionProps={{ duration: 100, transition: "pop-top-right" }}
          offset={{ mainAxis: 3, alignmentAxis: 5 }}
        >
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {can("restore task") && route().params.archived && (
              <Menu.Item
                leftSection={
                  <IconArchiveOff style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                color="blue"
                onClick={openRestoreModal}
              >
                Restore
              </Menu.Item>
            )}
            {can("archive task") && !route().params.archived && (
              <Menu.Item
                leftSection={
                  <IconArchive style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                color="red"
                onClick={openArchiveModal}
              >
                Archive
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
