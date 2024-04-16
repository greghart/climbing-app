import { EntitySchema } from "typeorm";
import { type ICoordinateLiteral } from "models";

// Embeddable Coordinate columns
export type CoordinateSchema = ICoordinateLiteral;

const Coordinate = new EntitySchema<CoordinateSchema>({
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

export default Coordinate;
