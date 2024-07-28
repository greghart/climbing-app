"use client";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useFormState from "@/app/_components/form/useFormState";
import areaSchema from "@/app/api/_schemas/area";
import { formActionHandler } from "@/app/api/formAction";
import { Stack } from "@mui/material";
import { Crag, IArea, ICrag } from "models";
import { z } from "zod";

interface Props<Meta> {
  crag: ICrag;
  area?: IArea;
  action: formActionHandler<IArea, z.infer<typeof areaSchema>, Meta>;
  meta: Meta;
}

export default function AreaForm<Meta>(props: Props<Meta>) {
  const crag = new Crag(props.crag);
  const [state, formAction, meta] = useFormState(props.action, {
    ok: true,
    data: props.area || ({} as IArea),
    meta: props.meta,
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
        {/** Polygon field */}
        <SubmitButton />
      </Stack>
    </form>
  );
}
