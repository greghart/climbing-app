"use client";

import { IApiResponse } from "@/app/api/ApiResponse";
import { CloudUpload } from "@mui/icons-material";
import {
  FormHelperText,
  Button as MUIButton,
  Stack,
  styled,
} from "@mui/material";
import React from "react";

/**
 * Climbing app file upload
 * * MUI Button presentation
 * * Easy hook up to `useFormState` and ApiResponse
 * * Distinguishes what we require vs optional customization
 */

type Props<
  Model,
  Schema extends Partial<Model>
> = React.ComponentProps<"input"> & {
  state: IApiResponse<Model, Schema, any>;
  name: keyof Schema & keyof Model;
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function UploadField<Model, Schema extends Partial<Model>>({
  state,
  children,
  ...props
}: Props<Model, Schema>) {
  const errText = state.fieldErrors?.[props.name]?.join(", ");
  return (
    <Stack>
      <MUIButton
        role={undefined}
        fullWidth
        component="label"
        startIcon={<CloudUpload />}
      >
        {children || `Upload ${props.name.toUpperCase()}`}
        <VisuallyHiddenInput
          type="file"
          onClick={(event) => {
            // reset input to allow re-uploading same file
            (event.target as any).value = "";
          }}
          {...(props as any)}
        />
      </MUIButton>
      {errText && <FormHelperText error>{errText}</FormHelperText>}
    </Stack>
  );
}
