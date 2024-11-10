"use client";
import AreasMap from "@/app/_components/explorer/map/AreasMap";
import PolygonField from "@/app/_components/form/PolygonField";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useFormState from "@/app/_components/form/useFormState";
import areaSchema from "@/app/api/_schemas/area";
import { formActionHandler } from "@/app/api/formAction";
import { FormHelperText, InputLabel, Stack } from "@mui/material";
import { Crag, IArea, ICrag } from "models";
import { z } from "zod";

interface Props<Meta> {
  crag: ICrag;
  area?: IArea;
  action: formActionHandler<IArea, z.infer<typeof areaSchema>, Meta>;
  meta: Meta;
}

export default function AreaForm<Meta extends {}>(props: Props<Meta>) {
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
        <InputLabel>Polygon</InputLabel>
        <PolygonField
          state={state}
          name="polygon"
          MapProps={{
            center: crag.center,
            bounds: crag.bounds,
          }}
          TracerProps={{
            children: (
              <AreasMap
                areas={crag.areas?.filter((a) => a.id !== props.area!.id) || []}
                AreaMapProps={{ onClick: undefined }}
              />
            ),
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
