import CoordinateOptional from "@/db/entity/CoordinateOptional";
import { IBounds } from "models";
import { EntitySchema } from "typeorm";
import { CoordinateSchema } from "./Coordinate";

// Embeddable Bounds columns
export type BoundsSchema = IBounds & {
  topLeft: CoordinateSchema;
  bottomRight: CoordinateSchema;
};

const Bounds = new EntitySchema<BoundsSchema>({
  name: "bounds",
  columns: {},
  embeddeds: {
    topLeft: {
      schema: CoordinateOptional,
      prefix: "top_left_",
    },
    bottomRight: {
      schema: CoordinateOptional,
      prefix: "bottom_right_",
    },
  },
});

export default Bounds;
