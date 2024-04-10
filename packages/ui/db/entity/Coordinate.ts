import { EntitySchema } from "typeorm";
import { type ICoordinate } from "models";

// Embeddable Coordinate columns
const Coordinate = new EntitySchema<ICoordinate>({
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
