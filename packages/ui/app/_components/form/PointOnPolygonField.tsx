"use client";
import Circle from "@/app/_components/map/Circle";
import CragMap from "@/app/_components/map/CragMap";
import PointOnPolygon from "@/app/_components/tracer/PointOnPolygon";
import { IApiResponse } from "@/app/api/ApiResponse";
import { Edit } from "@mui/icons-material";
import { Button, FormHelperText, Grid } from "@mui/material";
import { ICoordinateLiteral, ICrag, IPolygon } from "models";
import { useState } from "react";

/**
 * Climbing app map point on polygon field
 * * Displays inline map
 * * Edit to open up coordinate setter
 * * Coordinate setter is constrained to a given polygon
 * * Confirm to stage data into a Next.js compatible hidden input
 */
type Props<
  Key extends string,
  Model extends HasPointOnPolygon<Key>,
  Schema extends Model
> = {
  name: Key;
  state: IApiResponse<Model, Schema>;
  TracerProps?: Partial<React.ComponentProps<typeof PointOnPolygon>>;
  crag: ICrag;
  polygon?: IPolygon;
  renderPreview?: (c: ICoordinateLiteral | undefined) => React.ReactNode;
};

const defaultRenderPreview = (c: ICoordinateLiteral | undefined) =>
  c && <Circle style="pending" center={c} />;

type HasPointOnPolygon<Key extends string> = {
  [key in Key]?: ICoordinateLiteral; // optional is most flexible option
};

export default function PointOnPolygonField<
  Key extends string,
  Model extends HasPointOnPolygon<Key>,
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
            {(props.renderPreview || defaultRenderPreview)(current)}
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

  if (!props.polygon) {
    return "Set up a boulder polygon to choose where route is on this boulder";
  }

  return (
    <PointOnPolygon
      {...props.TracerProps}
      polygon={props.polygon}
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
