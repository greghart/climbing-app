"use client";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import updateCrag from "@/app/api/_actions/updateCrag";
import { Stack, TextField } from "@mui/material";
import { ICrag } from "models";
import React from "react";
import { useFormState } from "react-dom";

interface Props {
  crag: ICrag;
}

/**
 * Some design notes
 * If we want client side validation, we basically need to use client code
 * and can't do `<form action />`
 */
export default function CragForm(props: Props) {
  const [state, formAction] = useFormState(updateCrag, {
    ok: true,
    data: props.crag,
  });
  const [reqIndex, setReqIndex] = React.useState(0);
  React.useEffect(() => {
    setReqIndex((prev) => prev + 1);
  }, [state]);
  return (
    <form action={formAction}>
      <SubmitSnack kee={reqIndex} {...state} />
      <Stack sx={{ p: 1 }} spacing={1}>
        <TextField
          name="name"
          label="Name"
          required
          defaultValue={state.data!.name}
          error={"name" in (state.fieldErrors || {})}
          helperText={state.fieldErrors?.name?.join(",")}
        />
        <TextField
          name="description"
          label="Description"
          multiline
          rows={3}
          defaultValue={state.data!.description}
        />
        <SubmitButton />
      </Stack>
    </form>
  );
}
