"use client";
import AreasMap from "@/app/_components/explorer/map/AreasMap";
import BoundsField from "@/app/_components/form/BoundsField";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useFormState from "@/app/_components/form/useFormState";
import updateCrag from "@/app/api/_actions/updateCrag";
import { Stack } from "@mui/material";
import { Crag, ICrag } from "models";

interface Props {
  crag: ICrag;
}

/**
 * Some design notes
 * If we want client side validation, we basically need to use client code
 * and can't do `<form action />`
 */
export default function CragForm(props: Props) {
  const crag = new Crag(props.crag);
  const [state, formAction, meta] = useFormState(updateCrag, {
    ok: true,
    data: props.crag,
  });
  return (
    <form action={formAction}>
      <SubmitSnack kee={meta.reqIndex} {...state} />
      <Stack sx={{ p: 1 }} spacing={1}>
        <TextField state={state} name="name" />
        <TextField
          state={state}
          name="description"
          multiline
          rows={3}
          defaultValue={state.data!.description}
        />
        <BoundsField
          state={state}
          name="bounds"
          center={crag.center}
          tracerProps={{
            children: <AreasMap areas={crag.areas!} />,
          }}
        />
        <SubmitButton />
      </Stack>
    </form>
  );
}
