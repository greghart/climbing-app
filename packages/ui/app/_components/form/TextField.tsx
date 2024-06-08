"use client";

import { TextField as MUITextField } from "@mui/material";
import upperFirst from "lodash-es/upperFirst";
import React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { Controller, type Control } from "react-hook-form";

/**
 * Climbing app text field
 * * MUI TextField presentation
 * * Easy hook up to react-hook-form
 * * Next.js hooks
 * * Distinguishes what we require vs optional customization
 */

interface Props<FV extends FieldValues> {
  control: Control<FV>;
  name: FieldPath<FV>;
  controller?: Omit<
    React.ComponentProps<typeof Controller>,
    "control" | "name" | "render"
  >;
  field?: React.ComponentProps<typeof MUITextField>;
}

export default function TextField<FV extends FieldValues>(props: Props<FV>) {
  return (
    <Controller<FV>
      {...(props.controller || {})}
      control={props.control}
      name={props.name}
      render={({ field, fieldState, formState }) => {
        console.warn("state", { submitting: formState.isSubmitting });
        return (
          <MUITextField
            {...(props.field || {})}
            fullWidth
            disabled={fieldState.isValidating || formState.isSubmitting}
            error={fieldState.invalid}
            helperText={fieldState.error?.message}
            label={props.field?.label || upperFirst(props.name)}
            {...field}
          />
        );
      }}
    />
  );
}
