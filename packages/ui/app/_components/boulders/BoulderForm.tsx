"use client";
import CoordinateField from "@/app/_components/form/CoordinateField";
import PolygonField from "@/app/_components/form/PolygonField";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useFormState from "@/app/_components/form/useFormState";
import AreaMap from "@/app/_components/map/AreaMap";
import BoulderIcon from "@/app/_components/map/BoulderIcon";
import BoulderMap from "@/app/_components/map/BoulderMap";
import useAreaFit from "@/app/_components/map/useAreaFit";
import useBoulderView from "@/app/_components/map/useBoulderView";
import boulderSchema from "@/app/api/_schemas/boulder";
import { formActionHandler } from "@/app/api/formAction";
import { FormHelperText, InputLabel, Stack } from "@mui/material";
import { IArea, IBoulder, ICrag } from "models";
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

        <InputLabel>Location</InputLabel>
        <CoordinateField
          state={state}
          name="coordinates"
          crag={props.crag}
          renderPreview={(c) => (
            <>
              <AreaView area={props.boulder.area!} />
              <BoulderIcon position={c} />
              <AreaMap
                area={props.boulder.area!}
                onClick={undefined}
                tooltip={false}
                showBoulders={false}
              />
            </>
          )}
          TracerProps={{
            renderPending: (c) => (
              <>
                <AreaView area={props.boulder.area!} />
                <BoulderIcon position={c} />
                <AreaMap
                  area={props.boulder.area!}
                  onClick={undefined}
                  tooltip={false}
                  showBoulders={false}
                />
              </>
            ),
          }}
        />
        <FormHelperText>Set boulder location</FormHelperText>

        <InputLabel>Polygon</InputLabel>
        <PolygonField
          state={state}
          name="polygon"
          crag={props.crag}
          TracerProps={{
            snapDistance: 0.3,
            children: (
              <>
                <BoulderView boulder={props.boulder} />
                <BoulderIcon
                  position={props.boulder.coordinates}
                  opacity={0.5}
                />
                <AreaMap
                  area={props.boulder.area!}
                  onClick={undefined}
                  tooltip={false}
                  showBoulders={false}
                />
              </>
            ),
          }}
          mapPreview={
            <>
              <BoulderView boulder={props.boulder} />
              <BoulderMap boulder={props.boulder} showRoutes />
            </>
          }
        />
        <FormHelperText>
          Trace the boulder to help populate better route and shade data
        </FormHelperText>

        <SubmitButton />
      </Stack>
    </form>
  );
}

function BoulderView({ boulder }: { boulder: IBoulder }) {
  useBoulderView(boulder, { offset: 0.0 });
  return false;
}

function AreaView({ area }: { area: IArea }) {
  useAreaFit(area);
  return false;
}
