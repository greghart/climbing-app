"use client";
import BouldersList from "@/app/_components/explorer/overlay/BouldersList";
import useRouteTo from "@/app/_components/explorer/useRouteTo";
import { AssistantDirection } from "@mui/icons-material";
import { Collapse, IconButton, ListItem } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { IArea } from "models";
import * as React from "react";

interface Props {
  areas?: IArea[];
}

export default function AreasList({ areas = [] }: Props) {
  const routeTo = useRouteTo({ includeSearchParams: true })("area");
  const [expandedAreaId, setExpandedAreaId] = React.useState<
    number | undefined
  >(undefined);
  const handleExpand = (areaId: number) => {
    if (expandedAreaId === areaId) {
      setExpandedAreaId(undefined);
    } else {
      setExpandedAreaId(areaId);
    }
  };

  return (
    <List
      sx={{ width: "100%", maxWidth: "480px" }}
      component="nav"
      aria-labelledby="area-area-list-subheader"
    >
      {(areas || []).map((area) => (
        <React.Fragment key={area.id}>
          <ListItem
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="go"
                onClick={(e) => {
                  routeTo(area.id);
                }}
              >
                <AssistantDirection />
              </IconButton>
            }
          >
            <ListItemButton
              onClick={() => handleExpand(area.id!)}
              selected={expandedAreaId === area.id}
            >
              <ListItemText primary={area.name} />
            </ListItemButton>
          </ListItem>
          <Collapse
            in={expandedAreaId === area.id}
            timeout="auto"
            unmountOnExit
          >
            <BouldersList boulders={area.boulders} leftIndent={4} />
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
}
