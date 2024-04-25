import { List, ListItemButton, ListItemText } from "@mui/material";
import { IRoute } from "models";
import React, { MouseEvent } from "react";

interface Props {
  routes?: IRoute[];
  onClick?: (r: IRoute, e: MouseEvent<HTMLDivElement>) => void;
  ButtonProps?: Partial<React.ComponentProps<typeof ListItemButton>>;
}

export default function RoutesList(props: Props) {
  if (!(props.routes && props.routes.length > 0)) {
    return false;
  }
  return (
    <List
      component="div"
      disablePadding
      dense
      sx={{ width: "100%", maxWidth: "480px" }}
    >
      {props.routes.map((route) => (
        <ListItemButton
          {...props.ButtonProps}
          dense
          key={route.id}
          onClick={(e) => props.onClick?.(route, e)}
        >
          <ListItemText primary={route.name} secondary={route.gradeRaw} />
        </ListItemButton>
      ))}
    </List>
  );
}
