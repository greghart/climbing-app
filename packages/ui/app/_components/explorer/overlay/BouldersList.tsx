"use client";
import { usePathname, useRouter } from "next/navigation";
import { IBoulder } from "models";
import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Collapse, IconButton, ListItem, Typography } from "@mui/material";
import { AssistantDirection } from "@mui/icons-material";

interface Props {
  boulders?: IBoulder[];
}

export default function BouldersList({ boulders = [] }: Props) {
  const router = useRouter();
  const pathname = usePathname();
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
          <>
            <ListItem
              dense
              key={boulder.id}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="go"
                  onClick={(e) => {
                    router.push(`${pathname}/boulder/${boulder.id}`);
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
              <List component="div" disablePadding dense>
                {boulder.routes?.map((route) => (
                  <ListItemButton sx={{ pl: 4 }} dense>
                    <ListItemText
                      primary={route.name}
                      secondary={route.gradeRaw}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </>
        ))}
      </List>
    </>
  );
}
