"use client";
import * as Leaflet from "leaflet";
import Map from "../explorer/map/Map";
// import BoundsTracer from '../tracer/BoundsTracer.js';
// import MyBounds from '../map/MyBounds.js';
import BoundsPolygon from "@/app/_components/tracer/BoundsPolygon";
import BoundsTracer from "@/app/_components/tracer/BoundsTracer";
import { IApiResponse } from "@/app/api/ApiResponse.js";
import { Edit } from "@mui/icons-material";
import { Button, FormHelperText, Grid } from "@mui/material";
import { IBounds, ICoordinateLiteral, ICrag } from "models";
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
  center: ICoordinateLiteral;
  // Additional props to tracer
  tracerProps?: Partial<React.ComponentProps<typeof BoundsTracer>>;
};

type HasBoundsField<Key extends string> = {
  [key in Key]?: IBounds;
};

function toIBounds(bounds: Leaflet.LatLngBounds): IBounds {
  return {
    topLeft: bounds.getNorthWest(),
    bottomRight: bounds.getSouthEast(),
  };
}

export type BoundsFieldType = typeof BoundsField;
export default function BoundsField<
  Key extends string,
  Model extends HasBoundsField<Key>,
  Schema extends Model
>({ tracerProps, ...props }: Props<Key, Model, Schema>) {
  const test: ICrag = {} as any;

  const [isUpdating, setUpdating] = useState(false);
  const [current, setCurrent] = useState<IBounds | undefined>(
    props.state.data![props.name]
  );
  // Outer bounds based on center, don't let bounds be too big
  const outerBounds = toIBounds(
    new Leaflet.LatLng(props.center.lat, props.center.lng).toBounds(8000)
  );
  const errText = props.state.fieldErrors?.[props.name]?.join(", ");

  if (!isUpdating) {
    return (
      <Grid container padding={1}>
        <Grid item xs={9}>
          <Map bounds={outerBounds} style={{ paddingBottom: "50%" }}>
            {current && <BoundsPolygon bounds={current} />}
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
    <BoundsTracer
      {...tracerProps}
      mapBounds={outerBounds}
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
