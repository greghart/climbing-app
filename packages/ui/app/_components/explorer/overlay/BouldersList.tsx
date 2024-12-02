"use client";
import RoutesList from "@/app/_components/explorer/overlay/RoutesList";
import useRouteTo from "@/app/_components/explorer/useRouteTo";
import { AssistantDirection } from "@mui/icons-material";
import { Collapse, IconButton, ListItem } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { IBoulder, IRoute } from "models";
import * as React from "react";

interface Props {
  boulders?: IBoulder[];
  // spacing to left of buttons to help indent lists
  leftIndent?: number;
}

export default function BouldersList({ boulders = [], leftIndent = 0 }: Props) {
  const routeTo = useRouteTo({ includeSearchParams: true });
  const [expandedBoulderId, setExpandedBoulderId] = React.useState<
    number | undefined
  >(undefined);
  const handleExpand = (boulderId: number) => {
    if (expandedBoulderId === boulderId) {
      setExpandedBoulderId(undefined);
    } else {
      setExpandedBoulderId(boulderId);
    }
  };

  return (
    <List
      sx={{ width: "100%", maxWidth: "480px" }}
      component="nav"
      aria-labelledby="area-boulder-list-subheader"
    >
      {(boulders || []).map((boulder) => (
        <React.Fragment key={boulder.id}>
          <ListItem
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="go"
                onClick={(e) => {
                  routeTo("boulder")(boulder.id);
                }}
              >
                <AssistantDirection />
              </IconButton>
            }
          >
            <ListItemButton
              onClick={() => handleExpand(boulder.id!)}
              sx={{ pl: leftIndent }}
              selected={expandedBoulderId === boulder.id}
            >
              <ListItemText primary={boulder.name} />
            </ListItemButton>
          </ListItem>
          <Collapse
            in={expandedBoulderId === boulder.id}
            timeout="auto"
            unmountOnExit
          >
            <RoutesList
              routes={boulder.routes}
              ButtonProps={{ sx: { pl: leftIndent + 4 } }}
              onClick={(r: IRoute) => routeTo("route")(r.id)}
            />
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
}
