import { IconButton, InputAdornment, TextField } from "@mui/material";
import omit from "lodash-es/omit";
import React from "react";

type Props = React.ComponentProps<typeof TextField> & {
  // Props for prepend/append icon buttons, if any
  PrependButtonProps?: React.ComponentProps<typeof IconButton>;
  AppendButtonProps?: React.ComponentProps<typeof IconButton>;
};
/**
 * Our searcher is always part of a basic group
 * Also used as a template for titles on non search pages
 */
export default function SearchField(props: Props) {
  return (
    <TextField
      sx={{
        backgroundColor: "white",
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "black",
        },
      }}
      fullWidth
      variant="outlined"
      margin="dense"
      hiddenLabel
      size="small"
      placeholder="Search by area, boulder, or route"
      {...omit(
        props,
        "onClickPrepend",
        "onClickAppend",
        "prepend",
        "append",
        "PrependButtonProps",
        "AppendButtonProps"
      )}
      InputProps={{
        startAdornment: props.PrependButtonProps && (
          <InputAdornment position="start">
            <IconButton {...props.PrependButtonProps} />
          </InputAdornment>
        ),
        endAdornment: props.AppendButtonProps && (
          <InputAdornment position="end">
            <IconButton {...props.AppendButtonProps} />
          </InputAdornment>
        ),
        ...props.InputProps,
      }}
    />
  );
}
