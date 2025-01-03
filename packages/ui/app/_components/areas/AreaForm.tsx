"use client";
import PolygonField from "@/app/_components/form/PolygonField";
import SubmitButton from "@/app/_components/form/SubmitButton";
import SubmitSnack from "@/app/_components/form/SubmitSnack";
import TextField from "@/app/_components/form/TextField";
import useActionState from "@/app/_components/form/useActionState";
import AreaLayers from "@/app/_components/map/AreaLayers";
import AreasMap from "@/app/_components/map/AreasMap";
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
  const crag = Crag.build(props.crag);
  const [state, formAction, meta] = useActionState(props.action, {
    ok: true,
    data: props.area || ({} as IArea),
    meta: props.meta,
  });
  const area = crag.areas?.find((a) => a.id === state.data.id);
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
          crag={props.crag}
          TracerProps={{
            layersChildren: (Overlay, LayerGroup) => (
              <AreaLayers
                Overlay={Overlay}
                LayerGroup={LayerGroup}
                area={area}
                trail={crag.trail}
                areaLayer={
                  <AreasMap
                    areas={crag.areas.filter((a) => a.id !== props.area?.id)}
                    AreaMapProps={{
                      onClick: undefined,
                      PolygonProps: { fillColor: "#a5088d" },
                    }}
                  />
                }
              />
            ),
          }}
        />
        <FormHelperText>
          Trace the area polygon to help climbers navigate
        </FormHelperText>
        <SubmitButton />
      </Stack>
    </form>
  );
}
