"use client";
import CragMap from "@/app/_components/map/CragMap";
import TrailPolyline from "@/app/_components/tracer/TrailPolyline";
import TrailTracer from "@/app/_components/tracer/TrailTracer";
import { IApiResponse } from "@/app/api/ApiResponse.js";
import { Edit } from "@mui/icons-material";
import { Button, FormHelperText, Grid } from "@mui/material";
import { ICrag, ITrail } from "models";
import { useState } from "react";

/**
 * Climbing app map trail field
 * * Displays inline map
 * * Edit to open up trail tracer
 * * Confirm to stage data into a Next.js compatible hidden input
 */
type Props<
  Key extends string,
  Model extends HasTrailField<Key>,
  Schema extends Model
> = {
  name: Key;
  state: IApiResponse<Model, Schema>;
  crag: ICrag;
  // Additional props to tracer
  TracerProps?: Partial<React.ComponentProps<typeof TrailTracer>>;
};

type HasTrailField<Key extends string> = {
  [key in Key]?: ITrail;
};

export type TrailFieldType = typeof TrailField;
export default function TrailField<
  Key extends string,
  Model extends HasTrailField<Key>,
  Schema extends Model
>({ TracerProps, ...props }: Props<Key, Model, Schema>) {
  const [isUpdating, setUpdating] = useState(false);
  const [current, setCurrent] = useState<ITrail | undefined>(
    props.state.data![props.name]
  );
  const errText = props.state.fieldErrors?.[props.name]?.join(", ");

  if (!isUpdating) {
    return (
      <Grid container padding={1}>
        <Grid item xs={9}>
          <CragMap crag={props.crag} style={{ paddingBottom: "50%" }}>
            <TrailPolyline lines={current?.lines} />
          </CragMap>
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
    <TrailTracer
      {...TracerProps}
      crag={props.crag}
      defaultTrail={current}
      onCancel={() => setUpdating(false)}
      onSubmit={(trail) => {
        setCurrent(trail);
        setUpdating(false);
      }}
    />
  );
}
