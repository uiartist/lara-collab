import useNavigationStore from "@/hooks/store/useNavigationStore";
import { redirectToUrl } from "@/utils/route";
import { Box, Collapse, Group, UnstyledButton, rem } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import classes from "./css/NavbarLinksGroup.module.css";

function SubGroup({ subItem, onLeafClick }) {
  const hasLinks = Array.isArray(subItem.links);
  const [opened, setOpened] = useState(subItem.opened ?? false);

  if (!hasLinks) {
    return (
      <UnstyledButton
        className={`${classes.link} ${subItem.active ? classes.active : ""}`}
        onClick={() => onLeafClick(subItem)}
      >
        {subItem.label}
      </UnstyledButton>
    );
  }

  return (
    <>
      <UnstyledButton
        className={`${classes.link} ${subItem.active ? classes.active : ""}`}
        onClick={() => setOpened((o) => !o)}
      >
        <Group justify="space-between" gap={0} style={{ width: "100%" }}>
          <Box>{subItem.label}</Box>
          <IconChevronRight
            className={classes.chevron}
            stroke={1.5}
            style={{
              width: rem(14),
              height: rem(14),
              transform: opened ? "rotate(-90deg)" : "none",
            }}
          />
        </Group>
      </UnstyledButton>
      <Collapse in={opened}>
        {subItem.links.filter((l) => l.visible).map((leaf) => (
          <UnstyledButton
            key={leaf.label}
            className={`${classes.link} ${leaf.active ? classes.active : ""}`}
            style={{ paddingLeft: "calc(var(--mantine-spacing-md) * 2)" }}
            onClick={() => onLeafClick(leaf)}
          >
            {leaf.label}
          </UnstyledButton>
        ))}
      </Collapse>
    </>
  );
}

export default function NavbarLinksGroup({ item }) {
  const { toggle, active } = useNavigationStore();
  const hasLinks = Array.isArray(item.links);

  const itemClick = () => {
    if (hasLinks) {
      toggle(item.label);
    } else {
      active(item.label, false);
      redirectToUrl(item.link);
    }
  };

  const leafClick = (leaf) => {
    active(leaf.label, true);
    redirectToUrl(leaf.link);
  };

  return (
    <>
      <UnstyledButton
        onClick={itemClick}
        className={`${classes.control} ${item.active ? classes.active : ""}`}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <Box ml="md">{item.label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: item.opened ? "rotate(-90deg)" : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? (
        <Collapse in={item.opened}>
          {item.links.filter((l) => l.visible).map((subItem) => (
            <SubGroup key={subItem.label} subItem={subItem} onLeafClick={leafClick} />
          ))}
        </Collapse>
      ) : null}
    </>
  );
}
