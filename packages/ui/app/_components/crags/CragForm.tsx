"use client";
import { Button, Stack, TextField } from "@mui/material";
import { ICrag } from "models";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface Props {
  crag: Partial<ICrag>;
  onValid: SubmitHandler<FormData>;
}

export interface FormData {
  name: string;
  description: string;
}

export default function CragForm(props: Props) {
  const { formState, handleSubmit, control, reset } = useForm<FormData>({
    defaultValues: {
      name: props.crag.name,
      description: props.crag.description,
    },
  });

  const onSubmit = React.useCallback<SubmitHandler<FormData>>(
    (data) => {
      props.onValid(data);
    },
    [props.onValid]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ p: 1 }} spacing={1}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField fullWidth label="Name" {...field} />
          )}
        />
        <TextField
          multiline
          rows={3}
          label="Description"
          name="description"
          defaultValue={props.crag.description}
        />
        <Button color="success" variant="outlined" type="submit">
          Save
        </Button>
      </Stack>
    </form>
  );
}
