import { Column, EntitySchema } from "typeorm";
import { type ICoordinateOptional } from "models";

// Embeddable Coordinate columns that are nullable
const CoordinateOptional = new EntitySchema<ICoordinateOptional>({
  name: "coordinate",
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
