import Logo from "@/components/Logo";
import useNavigationStore from "@/hooks/store/useNavigationStore";
import { usePage } from "@inertiajs/react";
import { Group, ScrollArea, Text, rem } from "@mantine/core";
import {
  IconFileDollar,
  IconGauge,
  IconLayoutList,
  IconListDetails,
  IconReportAnalytics,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { useEffect } from "react";
import NavbarLinksGroup from "./NavbarLinksGroup";
import UserButton from "./UserButton";
import classes from "./css/NavBarNested.module.css";

export default function Sidebar() {
  const { version } = usePage().props;
  const { items, setItems } = useNavigationStore();

  useEffect(() => {
    setItems([
      {
        label: "Dashboard",
        icon: IconGauge,
        link: route("dashboard"),
        active: route().current("dashboard"),
        visible: true,
      },
      {
        label: "Master Data",
        icon: IconLayoutList,
        active: route().current("clients.*") || route().current("suppliers.*") || route().current("materials.*") || route().current("projects.*"),
        opened: route().current("clients.*") || route().current("suppliers.*") || route().current("materials.*") || route().current("projects.*"),
        visible: true,
        links: [
          {
            label: "Clients",
            link: route("clients.companies.index"),
            active: route().current("clients.*"),
            visible: can("view client users") || can("view client companies"),
          },
          {
            label: "Suppliers",
            link: route("suppliers.index"),
            active: route().current("suppliers.*"),
            visible: can("view suppliers"),
          },
          {
            label: "Materials",
            link: route("materials.index"),
            active: route().current("materials.*"),
            visible: true,
          },
          {
            label: "Projects",
            icon: IconListDetails,
            active: route().current("projects.*") || route().current("invoices.*") || route().current("reports.*"),
            opened: route().current("projects.*") || route().current("invoices.*") || route().current("reports.*"),
            visible: can("view projects") || can("view invoices") || can("view logged time sum report") || can("view daily logged time report") || can("view fixed price sum report"),
            links: [
              {
                label: "List",
                link: route("projects.index"),
                active: route().current("projects.index"),
                visible: can("view projects"),
              },
              {
                label: "Work Orders",
                link: route("work-orders.index"),
                active: route().current("work-orders"),
                visible: can("view projects"),
              },
              {
                label: "Invoices",
                link: route("invoices.index"),
                active: route().current("invoices.*"),
                visible: can("view invoices"),
              },
              {
                label: "Reports",
                link: route("reports.logged-time.sum"),
                active: route().current("reports.*"),
                visible: can("view logged time sum report") || can("view daily logged time report") || can("view fixed price sum report"),
              },
            ],
          },
        ],
      },
      {
        label: "My Work",
        icon: IconLayoutList,
        active: route().current("my-work.*"),
        opened: route().current("my-work.*"),
        visible: can("view tasks") || can("view activities"),
        links: [
          {
            label: "Tasks",
            link: route("my-work.tasks.index"),
            active: route().current("my-work.tasks.*"),
            visible: can("view tasks"),
          },
          {
            label: "Activity",
            link: route("my-work.activity.index"),
            active: route().current("my-work.activity.*"),
            visible: can("view activities"),
          },
        ],
      },
      {
        label: "Settings",
        icon: IconSettings,
        active: route().current("settings.*"),
        opened: route().current("settings.*"),
        visible: can("view owner company") || can("view roles") || can("view labels") || can("view configuration") || can("view development") || can("view security") || can("view code numbers"),
        links: [
          {
            label: "Company",
            link: route("settings.company.edit"),
            active: route().current("settings.company.*"),
            visible: can("view owner company"),
          },
          {
            label: "Team",
            link: route("users.index"),
            active: route().current("users.*"),
            visible: can("view users"),
          },
          {
            label: "Roles",
            link: route("settings.roles.index"),
            active: route().current("settings.roles.*"),
            visible: can("view roles"),
          },
          {
            label: "Labels",
            link: route("settings.labels.index"),
            active: route().current("settings.labels.*"),
            visible: can("view labels"),
          },
          // create routes for below links
          {
            label: "Configuration",
            link: route("settings.configuration.index"),
            active: route().current("settings.configuration.*"),
            visible: can("view configuration"),
          },
          {
            label: "Development",
            link: route("settings.development.index"),
            active: route().current("settings.development.*"),
            visible: can("view development"),
          },
          {
            label: "Security",
            link: route("settings.security.index"),
            active: route().current("settings.security.*"),
            visible: can("view security"),
          },
          {
            label: "Code Numbers",
            link: route("settings.code-numbers.index"),
            active: route().current("settings.code-numbers.*"),
            visible: can("view code numbers"),
          },
        ],
      },
    ]);
  }, []);

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Logo style={{ width: rem(120) }} />
          <Text size="xs" className={classes.version}>
            v{version}
          </Text>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>
          {items
            .filter((i) => i.visible)
            .map((item) => (
              <NavbarLinksGroup key={item.label} item={item} />
            ))}
        </div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserButton />
      </div>
    </nav>
  );
}
