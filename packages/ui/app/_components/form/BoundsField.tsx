"use client";
import CragMap from "@/app/_components/map/CragMap";
import BoundsPolygon from "@/app/_components/tracer/BoundsPolygon";
import BoundsTracer from "@/app/_components/tracer/BoundsTracer";
import { IApiResponse } from "@/app/api/ApiResponse.js";
import { Edit } from "@mui/icons-material";
import { Button, FormHelperText, Grid } from "@mui/material";
import { IBounds, ICrag } from "models";
import { useState } from "react";

/**
 * Climbing app map bounds field
 * * Displays inline map
 * * Edit to open up bounds tracer
 * * Confirm to stage data into a Next.js compatible hidden input
 */
type Props<
  Key extends string,
  Model extends HasBoundsField<Key>,
  Schema extends Model
> = {
  name: Key;
  state: IApiResponse<Model, Schema>;
  crag: ICrag;
  // Additional props to tracer
  TracerProps?: Partial<React.ComponentProps<typeof BoundsTracer>>;
};

type HasBoundsField<Key extends string> = {
  [key in Key]?: IBounds;
};

export default function BoundsField<
  Key extends string,
  Model extends HasBoundsField<Key>,
  Schema extends Model
>({ TracerProps, ...props }: Props<Key, Model, Schema>) {
  const [isUpdating, setUpdating] = useState(false);
  const [current, setCurrent] = useState<IBounds | undefined>(
    props.state.data![props.name]
  );
  const errText = props.state.fieldErrors?.[props.name]?.join(", ");

  if (!isUpdating) {
    return (
      <Grid container padding={1}>
        <Grid item xs={9}>
          <CragMap crag={props.crag} style={{ paddingBottom: "50%" }}>
            {current && <BoundsPolygon bounds={current} />}
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
    <BoundsTracer
      {...TracerProps}
      crag={props.crag}
      defaultBounds={current}
      onCancel={() => setUpdating(false)}
      onSubmit={(bounds) => {
        // TODO: Where to put client state?
        setCurrent(bounds);
        setUpdating(false);
      }}
    />
  );
}
