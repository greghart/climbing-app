"use client";
import { IBoulder, IRoute } from "models";
import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Collapse, IconButton, ListItem, Typography } from "@mui/material";
import { AssistantDirection } from "@mui/icons-material";
import useRouteTo from "@/app/_components/useRouteTo";
import RoutesList from "@/app/_components/explorer/overlay/RoutesList";

interface Props {
  boulders?: IBoulder[];
}

export default function BouldersList({ boulders = [] }: Props) {
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
    <>
      <Typography variant="subtitle1">Boulders</Typography>
      <List
        sx={{ width: "100%", maxWidth: "480px" }}
        component="nav"
        aria-labelledby="area-boulder-list-subheader"
      >
        {(boulders || []).map((boulder) => (
          <React.Fragment key={boulder.id}>
            <ListItem
              dense
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="go"
                  onClick={(e) => {
                    routeTo(`boulder/${boulder.id}`);
                  }}
                >
                  <AssistantDirection />
                </IconButton>
              }
            >
              <ListItemButton
                role={undefined}
                dense
                onClick={() => handleExpand(boulder.id!)}
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
                ButtonProps={{ sx: { pl: 4 } }}
                onClick={(r: IRoute) =>
                  routeTo(`boulder/${boulder.id}/route/${r.id}`)
                }
              />
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </>
  );
}
