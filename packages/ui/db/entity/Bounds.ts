import { type CoordinateOptional } from "@/db/entity";
import CoordinateOptionalSchema from "@/db/entity/CoordinateOptional";
import { IBounds } from "models";
import { EntitySchema } from "typeorm";

// Embeddable Bounds columns
export type Bounds = Omit<IBounds, "topLeft" | "bottomRight"> & {
  topLeft: CoordinateOptional;
  bottomRight: CoordinateOptional;
};

const BoundsSchema = new EntitySchema<Bounds>({
  name: "bounds",
  columns: {},
  embeddeds: {
    topLeft: {
      schema: CoordinateOptionalSchema,
      prefix: "top_left_",
    },
    bottomRight: {
      schema: CoordinateOptionalSchema,
      prefix: "bottom_right_",
    },
  },
});

export default BoundsSchema;
