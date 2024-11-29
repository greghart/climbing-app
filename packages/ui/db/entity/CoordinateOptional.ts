import { type ICoordinateOptional } from "models";
import { EntitySchema } from "typeorm";

// Embeddable Coordinate columns that are nullable
export type CoordinateOptional = ICoordinateOptional;

const CoordinateOptionalSchema = new EntitySchema<CoordinateOptional>({
  name: "coordinate_optional",
  columns: {
    lat: {
      type: "decimal",
      nullable: true,
    },
    lng: {
      type: "decimal",
      nullable: true,
    },
  },
});

export default CoordinateOptionalSchema;
