"use client";
import BoundsField from "@/app/_components/form/BoundsField";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useActionState from "@/app/_components/form/useActionState";
import CragLayers from "@/app/_components/map/CragLayers";
import updateCrag from "@/app/api/_actions/updateCrag";
import { FormHelperText, InputLabel, Stack } from "@mui/material";
import { Crag, ICrag } from "models";

interface Props {
  crag: ICrag;
}

export default function CragForm(props: Props) {
  const crag = new Crag(props.crag);
  const [state, formAction, meta] = useActionState(updateCrag, {
    ok: true,
    data: props.crag,
    meta: { id: props.crag.id!, fieldMask: ["bounds", "name", "description"] },
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
        <InputLabel>BOUNDS</InputLabel>
        <BoundsField
          state={state}
          name="bounds"
          crag={crag}
          TracerProps={{
            layersChildren: CragLayers.builder(crag),
          }}
        />
        <FormHelperText>
          Dictates the bounds of the crag for map purposes
        </FormHelperText>
        <SubmitButton />
      </Stack>
    </form>
  );
}
