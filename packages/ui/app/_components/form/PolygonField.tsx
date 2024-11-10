"use client";
import Map from "@/app/_components/explorer/map/Map";
import MyPolygon from "@/app/_components/explorer/map/MyPolygon";
import PolygonTracer from "@/app/_components/tracer/PolygonTracer";
import { IApiResponse } from "@/app/api/ApiResponse.js";
import { Edit } from "@mui/icons-material";
import { Button, FormHelperText, Grid } from "@mui/material";
import { IPolygon } from "models";
import { useState } from "react";

/**
 * Climbing app map polygon field
 * * Displays inline map
 * * Edit to open up polygon tracer
 * * Confirm to stage data into a Next.js compatible hidden input
 */
type Props<
  Key extends string,
  Model extends HasPolygonField<Key>,
  Schema extends Model
> = {
  name: Key;
  state: IApiResponse<Model, Schema>;
  MapProps: React.ComponentProps<typeof Map>;
  TracerProps?: Partial<React.ComponentProps<typeof PolygonTracer>>;
};

type HasPolygonField<Key extends string> = {
  [key in Key]?: IPolygon;
};

export type PolygonFieldType = typeof PolygonField;
export default function PolygonField<
  Key extends string,
  Model extends HasPolygonField<Key>,
  Schema extends Model
>({ TracerProps, MapProps, ...props }: Props<Key, Model, Schema>) {
  const [isUpdating, setUpdating] = useState(false);
  const [current, setCurrent] = useState<IPolygon | undefined>(
    props.state.data![props.name]
  );
  const errText = props.state.fieldErrors?.[props.name]?.join(", ");

  if (!isUpdating) {
    return (
      <Grid container padding={1}>
        <Grid item xs={9}>
          <Map {...MapProps} style={{ paddingBottom: "50%" }}>
            <MyPolygon positions={current?.coordinates || []} />
          </Map>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            {...props}
            onClick={() => setUpdating(!isUpdating)}
          >
            <Edit />
          </Button>
        </Grid>
        <Grid item xs={12}>
          {errText && <FormHelperText error>{errText}</FormHelperText>}
        </Grid>
        {current && (
          <input
            name={props.name}
            type="hidden"
            value={JSON.stringify(current)}
          />
        )}
      </Grid>
    );
  }

  return (
    <PolygonTracer
      MapProps={MapProps}
      {...TracerProps}
      defaultPolygon={current}
      onCancel={() => setUpdating(false)}
      onSubmit={(polygon) => {
        setCurrent(polygon);
        setUpdating(false);
      }}
    />
  );
}
