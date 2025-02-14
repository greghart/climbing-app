"use client";
import CoordinateField from "@/app/_components/form/CoordinateField";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useActionState from "@/app/_components/form/useActionState";
import putParking, { type Meta } from "@/app/api/_actions/putParking";
import { FormHelperText, InputLabel, Stack } from "@mui/material";
import { ICrag, IParking } from "models";

interface Props {
  crag: ICrag;
  parking?: IParking;
  meta: Meta;
}

export default function ParkingForm(props: Props) {
  const [state, formAction, meta] = useActionState(putParking, {
    ok: true,
    data: props.parking || ({} as IParking),
    meta: props.meta,
  });
  return (
    <form action={formAction}>
      <SubmitSnack kee={meta.reqIndex} {...state} />
      <Stack sx={{ p: 1 }} spacing={1}>
        <TextField
          state={state}
          name="name"
          placeholder="Defaults to 'Crag Parking'"
        />
        <TextField
          state={state}
          name="description"
          placeholder="Describe directions and/or parking situation"
          multiline
          rows={3}
          defaultValue={state.data!.description}
        />
        <InputLabel>Location</InputLabel>
        <CoordinateField state={state} name="location" crag={props.crag} />
        <FormHelperText>
          Set the location of the parking. Required.
        </FormHelperText>
        <SubmitButton />
      </Stack>
    </form>
  );
}
