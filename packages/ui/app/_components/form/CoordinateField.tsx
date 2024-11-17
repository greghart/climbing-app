"use client";
import CragMap from "@/app/_components/map/CragMap";
import Marker from "@/app/_components/map/Marker";
import CoordinateTracer from "@/app/_components/tracer/CoordinateTracer";
import { IApiResponse } from "@/app/api/ApiResponse";
import { Edit } from "@mui/icons-material";
import { Button, FormHelperText, Grid } from "@mui/material";
import { ICoordinateLiteral, ICrag } from "models";
import { useState } from "react";

/**
 * Climbing app map coordinate field
 * * Displays inline map
 * * Edit to open up coordinate setter
 * * Confirm to stage data into a Next.js compatible hidden input
 */
type Props<
  Key extends string,
  Model extends HasCoordinateField<Key>,
  Schema extends Model
> = {
  name: Key;
  state: IApiResponse<Model, Schema>;
  TracerProps?: Partial<React.ComponentProps<typeof CoordinateTracer>>;
  crag: ICrag;
  renderPreview?: (c: ICoordinateLiteral) => React.ReactNode;
};

const defaultRenderPreview = (c: ICoordinateLiteral) => <Marker position={c} />;

type HasCoordinateField<Key extends string> = {
  [key in Key]?: ICoordinateLiteral; // optional is most flexible option
};

export type CoordinateFieldType = typeof CoordinateField;
export default function CoordinateField<
  Key extends string,
  Model extends HasCoordinateField<Key>,
  Schema extends Model
>({ ...props }: Props<Key, Model, Schema>) {
  const [isUpdating, setUpdating] = useState(false);
  const [current, setCurrent] = useState<ICoordinateLiteral | undefined>(
    props.state.data![props.name]
  );
  const errText = props.state.fieldErrors?.[props.name]?.join(", ");

  if (!isUpdating) {
    return (
      <Grid container padding={1}>
        <Grid item xs={9}>
          <CragMap crag={props.crag} style={{ paddingBottom: "50%" }}>
            {current && (props.renderPreview || defaultRenderPreview)(current)}
          </CragMap>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={() => setUpdating(!isUpdating)}>
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
    <CoordinateTracer
      {...props.TracerProps}
      crag={props.crag}
      defaultCoordinate={current}
      onCancel={() => setUpdating(false)}
      onSubmit={(coordinate) => {
        setCurrent(coordinate);
        setUpdating(false);
      }}
    />
  );
}
