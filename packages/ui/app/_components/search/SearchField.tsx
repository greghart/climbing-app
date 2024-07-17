import { IconButton, InputAdornment, TextField } from "@mui/material";
import omit from "lodash-es/omit";
import React from "react";

type Props = React.ComponentProps<typeof TextField> & {
  onClickPrepend?: React.MouseEventHandler<any>;
  onClickAppend?: React.MouseEventHandler<any>;
  // Prepend and append are always icon buttons
  prepend?: React.ReactNode;
  append?: React.ReactNode;
};
/**
 * Our searcher is always part of a basic group
 * Also used as a template for titles on non search pages
 * TODO: Convert to MUI
 */
export default function SearchField(props: Props) {
  return (
    <TextField
      sx={{ backgroundColor: "white" }}
      fullWidth
      variant="outlined"
      margin="dense"
      hiddenLabel
      size="small"
      placeholder="Search by area, boulder, or route"
      {...omit(props, "onClickPrepend", "onClickAppend", "prepend", "append")}
      InputProps={{
        ...props.InputProps,
        startAdornment: props.prepend && (
          <InputAdornment position="start">
            <IconButton onClick={props.onClickPrepend}>
              {props.prepend}
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: props.append && (
          <InputAdornment position="end">
            <IconButton onClick={props.onClickAppend}>
              {props.append}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
