import { Label } from "@/components/Label";
import TaskGroupLabel from "@/components/TaskGroupLabel";
import { diffForHumans } from "@/utils/datetime";
import { redirectTo } from "@/utils/route";
import { isOverdue } from "@/utils/task";
import { shortName } from "@/utils/user";
import { Link } from "@inertiajs/react";
import { Group, Pill, Text, Tooltip, rem, Table } from "@mantine/core";

import TableHead from "@/components/TableHead";
import TableRowEmpty from "@/components/TableRowEmpty";
import classes from "./css/Task.module.css";
import dayjs from "dayjs";

export default function Task({ task }) {
  return (
            <tr key={task.id} className="border-secondary">
              <td scope="row" className='px-1'>{task.id}</td>
              <td>
                {/* <pre>{JSON.stringify(task, null, 2)}</pre> */}
                <Text
                  className={classes.name}
                  size="sm"
                  fw={500}
                  truncate="end"
                  c={isOverdue(task) && task.completed_at === null ? "red" : ""}
                  onClick={() => redirectTo("projects.tasks.open", [task.project_id, task.id])}
                  style={{ cursor: "pointer" }}
                >
                  #{task.number + ": " + task.name}
                </Text>
              </td>
              <td>
                {task.assigned_to_user && (
                <Link href={route("users.edit", task.assigned_to_user.id)}>
                  <Tooltip label={task.assigned_to_user.name} openDelay={1000} withArrow>
                    <Pill size="sm" className={classes.user}>
                      {shortName(task.assigned_to_user.name)}
                    </Pill>
                  </Tooltip>
                </Link>
              )}
              </td>
              <td>
                {task.created_by_user && (
                  <Link href={route("users.edit", task.created_by_user.id)}>
                    <Tooltip label={task.created_by_user.name} openDelay={1000} withArrow>
                      <Pill size="sm" className={classes.user}>
                        {shortName(task.created_by_user.name)}
                      </Pill>
                    </Tooltip>
                  </Link>
                )}
              </td>
              <td>
<Tooltip label="Task group" openDelay={1000} withArrow>
                <TaskGroupLabel size="sm">{task.task_group.name}</TaskGroupLabel>
              </Tooltip>
              </td>
              <td>
{task.due_on && (
                <Text size="sm" color="dimmed">
                  {dayjs(task.due_on).format("D. MMM YYYY H:mm")}
                </Text>
              )}
              </td>
            </tr>

      /* <Table.ScrollContainer miw={800} my="lg">
        <Table verticalSpacing="sm">
          <TableHead columns={columns} />
          <Table.Tbody>
            <Table.Tr key={task.id}>
              <Table.Td className="w-1/4" style={{ width: "25%" }}>
                <Text
                  className={classes.name}
                  size="sm"
                  fw={500}
                  truncate="end"
                  c={isOverdue(task) && task.completed_at === null ? "red" : ""}
                  onClick={() => redirectTo("projects.tasks.open", [task.project_id, task.id])}
                  style={{ cursor: "pointer" }}
                >
                  #{task.number + ": " + task.name}
                </Text>
            </Table.Td>
            <Table.Td style={{ width: "25%" }}>
              {task.assigned_to_user && (
                <Link href={route("users.edit", task.assigned_to_user.id)}>
                  <Tooltip label={task.assigned_to_user.name} openDelay={1000} withArrow>
                    <Pill size="sm" className={classes.user}>
                      {shortName(task.assigned_to_user.name)}
                    </Pill>
                  </Tooltip>
                </Link>
              )}
            </Table.Td>
            <Table.Td style={{ width: "25%" }}>
              <Tooltip label="Task group" openDelay={1000} withArrow>
                <TaskGroupLabel size="sm">{task.task_group.name}</TaskGroupLabel>
              </Tooltip>
            </Table.Td>
            <Table.Td style={{ width: "25%" }}>
              {task.due_on && (
                <Text size="sm" color="dimmed">
                  {dayjs(task.due_on).format("D. MMM YYYY H:mm")}
                </Text>
              )}
            </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>*/

      /* <table className={classes.table}>
        <tbody>
          <tr>
            <td>
              <Tooltip
                disabled={!isOverdue(task)}
                label={`${diffForHumans(task.due_on, true)} overdue`}
                openDelay={1000}
                withArrow
              >
                <Text
                  className={classes.name}
                  size="sm"
                  fw={500}
                  truncate="end"
                  c={isOverdue(task) && task.completed_at === null ? "red" : ""}
                  onClick={() => redirectTo("projects.tasks.open", [task.project_id, task.id])}
                  style={{ cursor: "pointer" }}
                >
                  #{task.number + ": " + task.name}
                </Text>
              </Tooltip>
            </td>
            <td>
              {task.assigned_to_user && (
                <Link href={route("users.edit", task.assigned_to_user.id)}>
                  <Tooltip label={task.assigned_to_user.name} openDelay={1000} withArrow>
                    <Pill size="sm" className={classes.user}>
                      {shortName(task.assigned_to_user.name)}
                    </Pill>
                  </Tooltip>
                </Link>
              )}
            </td>
            <td>
              <Tooltip label="Task group" openDelay={1000} withArrow>
                <TaskGroupLabel size="sm">{task.task_group.name}</TaskGroupLabel>
              </Tooltip>
            </td>
            <td>
              {task.due_on && (
                <Text size="sm" color="dimmed">
                  {dayjs(task.due_on).format("D. MMM YYYY H:mm")}
                </Text>
              )}
            </td>
            <td>
              <Group wrap="wrap" style={{ rowGap: rem(3), columnGap: rem(12) }}>
                {task.labels.map((label) => (
                  <Label key={label.id} name={label.name} color={label.color} />
                ))}
              </Group>
            </td>
          </tr>
        </tbody>
      </table> */
  );
}
