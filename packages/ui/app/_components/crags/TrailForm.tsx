"use client";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TrailField from "@/app/_components/form/TrailField";
import useActionState from "@/app/_components/form/useActionState";
import updateCrag from "@/app/api/_actions/updateCrag";
import cragSchema from "@/app/api/_schemas/crag";
import { formActionHandler } from "@/app/api/formAction";
import { FormHelperText, InputLabel, Stack } from "@mui/material";
import { Crag, ICrag } from "models";
import { z } from "zod";

interface Props<Meta> {
  crag: ICrag;
  action: formActionHandler<ICrag, z.infer<typeof cragSchema>, Meta>;
  meta: Meta;
}

export default function CragForm<Meta>(props: Props<Meta>) {
  const crag = new Crag(props.crag);
  const [state, formAction, meta] = useActionState(updateCrag, {
    ok: true,
    data: props.crag,
    meta: {},
  });
  return (
    <form action={formAction}>
      <SubmitSnack kee={meta.reqIndex} {...state} />
      <Stack sx={{ p: 1 }} spacing={1}>
        <InputLabel>TRAIL</InputLabel>
        <TrailField state={state} name="trail" crag={crag} />
        <FormHelperText>
          Setup a walking trail for the crag to hint at the best path to take.
        </FormHelperText>
        <SubmitButton />
      </Stack>
    </form>
  );
}
