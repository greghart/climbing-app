import { type ICoordinateLiteral } from "models";
import { EntitySchema } from "typeorm";

// Embeddable Coordinate columns
export type Coordinate = ICoordinateLiteral;

const CoordinateSchema = new EntitySchema<Coordinate>({
  name: "coordinate",
  columns: {
    lat: {
      type: "decimal",
    },
    lng: {
      type: "decimal",
    },
  },
});

export default CoordinateSchema;
