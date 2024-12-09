"use client";

import { IApiResponse } from "@/app/api/ApiResponse";
import { TextField as MUITextField } from "@mui/material";

/**
 * Climbing app text field
 * * MUI TextField presentation
 * * Easy hook up to `useFormState` and ApiResponse
 * * Distinguishes what we require vs optional customization
 */

type Props<Model, Schema extends Partial<Model>> = React.ComponentProps<
  typeof MUITextField
> & {
  state: IApiResponse<Model, Schema, any>;
  name: keyof Schema & keyof Model;
};

export default function TextField<Model, Schema extends Partial<Model>>({
  state,
  ...props
}: Props<Model, Schema>) {
  return (
    <MUITextField
      {...props}
      label={props.label || props.name.toUpperCase()}
      fullWidth
      defaultValue={state.data![props.name]}
      error={props.name in (state.fieldErrors || {})}
      helperText={state.fieldErrors?.[props.name]?.join(",")}
    />
  );
}
