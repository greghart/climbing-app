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
import { IBoulder } from "models";
import React from "react";

interface Props {
  boulder: IBoulder;
}

export default function BoulderShowOverview(props: Props) {
  const [expandedRoutes, setExpandedRoutes] = React.useState<boolean>(false);
  const handleExpand = () => {
    setExpandedRoutes(!expandedRoutes);
  };
  return (
    <>
      <List>
        <ListItem>
          <ListItemText
            primary={
              /* refactor below to nicer re-usable component for show pages */
              <Breadcrumbs
                crag={props.boulder.area!.crag!}
                cragHref={`/crags/${props.boulder.area!.crag!.id!}`}
                cragIconHref={`/crags/${props.boulder.area!.crag!.id!}/edit`}
                cragIcon={<Edit />}
                area={props.boulder.area!}
                areaHref={`/areas/${props.boulder.area!.id!}`}
                areaIconHref={`/areas/${props.boulder.area!.id!}/edit`}
                areaIcon={<Edit />}
              />
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText>
            <Typography variant="body2" component="pre">
              {props.boulder.description}
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemButton href={`/boulders/${props.boulder.id}/routes/new`}>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="Add a new route on this boulder" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            component="a"
            href={`/boulders/${props.boulder.id}/edit`}
          >
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText primary="Edit this boulder" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => handleExpand()}>
            <ListItemText
              primary={
                <>
                  {(props.boulder.routes || []).length} routes on this boulder
                </>
              }
            />
            {expandedRoutes ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={expandedRoutes} timeout="auto" unmountOnExit>
          <List sx={{ width: "100%", maxWidth: "480px" }}>
            {(props.boulder.routes || []).map((route) => (
              <React.Fragment key={route.id}>
                <ListItem>
                  <ListItemButton href={`/routes/${route.id}`}>
                    <ListItemText
                      inset
                      primary={route.name}
                      secondary={route.gradeRaw}
                    />
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
