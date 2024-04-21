import { Column, EntitySchema } from "typeorm";
import { type ICoordinateOptional } from "models";

// Embeddable Coordinate columns that are nullable
export type CoordinateOptionalSchema = ICoordinateOptional;

const CoordinateOptional = new EntitySchema<CoordinateOptionalSchema>({
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

export default CoordinateOptional;
