"use client";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import { Edit } from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { IRoute } from "models";

interface Props {
  route: IRoute;
}

export default function RouteShowOverview(props: Props) {
  return (
    <>
      <List>
        <ListItem>
          <ListItemText
            primary={
              /* refactor below to nicer re-usable component for show pages */
              <Breadcrumbs
                crag={props.route.boulder!.area!.crag!}
                cragHref={`/crags/${props.route.boulder!.area!.crag!.id!}`}
                cragIconHref={`/crags/${props.route.boulder!.area!.crag!
                  .id!}/edit`}
                cragIcon={<Edit />}
                area={props.route.boulder!.area!}
                areaHref={`/areas/${props.route.boulder!.area!.id!}`}
                areaIconHref={`/areas/${props.route.boulder!.area!.id!}/edit`}
                areaIcon={<Edit />}
                boulder={props.route.boulder!}
                boulderHref={`/boulders/${props.route.boulder!.id!}`}
                boulderIconHref={`/boulders/${props.route.boulder!.id!}/edit`}
                boulderIcon={<Edit />}
              />
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText>
            <Typography variant="body2" component="pre">
              {props.route.description}
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemButton component="a" href={`/routes/${props.route.id}/edit`}>
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText primary="Edit this route" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
}
