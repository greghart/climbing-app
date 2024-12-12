"use client";
import PointOnPolygonField from "@/app/_components/form/PointOnPolygonField";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useActionState from "@/app/_components/form/useActionState";
import BoulderMap from "@/app/_components/map/BoulderMap";
import Circle from "@/app/_components/map/Circle";
import useBoulderView from "@/app/_components/map/useBoulderView";
import routeSchema from "@/app/api/_schemas/route";
import { formActionHandler } from "@/app/api/formAction";
import { FormHelperText, InputLabel, Stack } from "@mui/material";
import { IBoulder, IRoute } from "models";
import { z } from "zod";

interface Props<Meta> {
  boulder: IBoulder;
  route?: IRoute;
  action: formActionHandler<IRoute, z.infer<typeof routeSchema>, Meta>;
  meta: Meta;
}

export default function RouteForm<Meta extends {}>(props: Props<Meta>) {
  const [state, formAction, meta] = useActionState(props.action, {
    ok: true,
    data: props.route || ({} as IRoute),
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
        <TextField state={state} name="gradeRaw" label="Grade" />

        <InputLabel>Location</InputLabel>
        <PointOnPolygonField
          state={state}
          name="coordinates"
          crag={props.boulder.area!.crag!}
          polygon={props.boulder.polygon}
          renderPreview={(c) => (
            <>
              <BoulderView boulder={props.boulder} />
              <BoulderMap boulder={props.boulder} />
              <Circle center={c} />
            </>
          )}
          TracerProps={{
            renderPending: (c) => (
              <>
                <BoulderView boulder={props.boulder} />
                <BoulderMap boulder={props.boulder} />
              </>
            ),
          }}
        />
        {!props.boulder!.polygon && (
          <FormHelperText>
            Setup a boulder polygon to set route location on boulder
          </FormHelperText>
        )}

        <SubmitButton />
      </Stack>
    </form>
  );
}

function BoulderView({ boulder }: { boulder: IBoulder }) {
  useBoulderView(boulder, { offset: 0.0 });
  return false;
}
