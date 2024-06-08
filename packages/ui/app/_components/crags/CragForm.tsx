"use client";
import TextField from "@/app/_components/form/TextField";
import { Button, Stack } from "@mui/material";
import { ICrag } from "models";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props {
  crag: Partial<ICrag>;
  onValid: SubmitHandler<FormData>;
}

export interface FormData {
  name: string;
  description: string;
}

/**
 * Some design notes
 * If we want client side validation, we basically need to use client code
 * and can't do `<form action />`
 */
export default function CragForm(props: Props) {
  const { formState, handleSubmit, control, reset } = useForm<FormData>({
    defaultValues: {
      name: props.crag.name,
      description: props.crag.description,
    },
  });

  const onSubmit = React.useCallback<SubmitHandler<FormData>>(
    (data) => {
      return props.onValid(data);
    },
    [props.onValid]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ p: 1 }} spacing={1}>
        <TextField
          control={control}
          name="name"
          controller={{
            rules: {
              required: "required",
            },
          }}
        />
        <TextField
          control={control}
          name="description"
          field={{
            multiline: true,
            rows: 3,
          }}
        />
        <Button
          color="success"
          variant="outlined"
          type="submit"
          disabled={formState.isSubmitting}
        >
          Save
        </Button>
      </Stack>
    </form>
  );
}
