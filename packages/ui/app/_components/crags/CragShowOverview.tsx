"use client";
import { Add, Edit, ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { ICrag } from "models";
import React from "react";

interface Props {
  crag: ICrag;
}

export default function CragShowOverview(props: Props) {
  const [expandedAreas, setExpandedAreas] = React.useState<boolean>(false);
  const handleExpand = () => {
    setExpandedAreas(!expandedAreas);
  };
  return (
    <>
      <Typography variant="body2">{props.crag.description}</Typography>
      <List>
        <ListItem>
          <ListItemButton href={`/crags/${props.crag.id}/areas/new`}>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="Add a new area in this crag" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            component="a"
            href={`/crags/${props.crag.id}/trails/new`}
          >
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="Setup a trail in this crag" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton component="a" href={`/crags/${props.crag.id}/edit`}>
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText primary="Edit this crag" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => handleExpand()}>
            <ListItemText
              primary={
                <>{(props.crag.areas || []).length} areas in this crag</>
              }
            />
            {expandedAreas ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={expandedAreas} timeout="auto" unmountOnExit>
          <List sx={{ width: "100%", maxWidth: "480px" }}>
            {(props.crag.areas || []).map((area) => (
              <React.Fragment key={area.id}>
                <ListItem>
                  <ListItemButton href={`/areas/${area.id}`}>
                    <ListItemText inset primary={area.name} />
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Collapse>
      </List>
    </>
  );
}
