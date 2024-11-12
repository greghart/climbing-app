"use client";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
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
import { IArea } from "models";
import React from "react";

interface Props {
  area: IArea;
}

export default function AreaShowOverview(props: Props) {
  const [expandedBoulders, setExpandedBoulders] =
    React.useState<boolean>(false);
  const handleExpand = () => {
    setExpandedBoulders(!expandedBoulders);
  };
  return (
    <>
      <List>
        <ListItem>
          <ListItemText
            primary={
              <Breadcrumbs
                crag={props.area.crag!}
                cragHref={`/crags/${props.area.crag!.id!}`}
                cragIconHref={`/crags/${props.area.crag!.id!}/edit`}
                cragIcon={<Edit />}
              />
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText>
            <Typography variant="body2" component="pre">
              {props.area.description}
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemButton href={`/areas/${props.area.id}/boulders/new`}>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="Add a new boulder in this area" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton component="a" href={`/areas/${props.area.id}/edit`}>
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText primary="Edit this area" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => handleExpand()}>
            <ListItemText
              primary={
                <>{(props.area.boulders || []).length} boulders in this area</>
              }
            />
            {expandedBoulders ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={expandedBoulders} timeout="auto" unmountOnExit>
          <List sx={{ width: "100%", maxWidth: "480px" }}>
            {(props.area.boulders || []).map((boulder) => (
              <React.Fragment key={boulder.id}>
                <ListItem>
                  <ListItemButton href={`/boulders/${boulder.id}`}>
                    <ListItemText inset primary={boulder.name} />
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
