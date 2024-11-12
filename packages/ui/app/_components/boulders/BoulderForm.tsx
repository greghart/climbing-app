"use client";
import AreasMap from "@/app/_components/explorer/map/AreasMap";
import PolygonField from "@/app/_components/form/PolygonField";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useFormState from "@/app/_components/form/useFormState";
import boulderSchema from "@/app/api/_schemas/boulder";
import { formActionHandler } from "@/app/api/formAction";
import { FormHelperText, InputLabel, Stack } from "@mui/material";
import { IBoulder, ICrag } from "models";
import { z } from "zod";

interface Props<Meta> {
  crag: ICrag;
  boulder: IBoulder; // TODO: Support adding a boulder to an area -- requires default data for coordinate, name, etc.
  action: formActionHandler<IBoulder, z.infer<typeof boulderSchema>, Meta>;
  meta: Meta;
}

export default function BoulderForm<Meta extends {}>(props: Props<Meta>) {
  const [state, formAction, meta] = useFormState(props.action, {
    ok: true,
    data: props.boulder,
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
        {/**
         * TODO: Should be an AreaMap that is centered on the area this boulder is in
         * TODO: Should include the location of the boulder as well, and it should be the client side data for the tracer as well
         */}
        <PolygonField
          state={state}
          name="polygon"
          crag={props.crag}
          TracerProps={{
            children: (
              <AreasMap
                areas={[props.boulder.area!]}
                AreaMapProps={{ onClick: undefined, tooltip: false }}
              />
            ),
          }}
        />
        <FormHelperText>
          Trace the boulder to help populate better route and shade data
        </FormHelperText>
        <SubmitButton />
      </Stack>
    </form>
  );
}
