import { EntitySchema } from "typeorm";
import { type ICrag } from "models";
import CoordinateOptional from "./CoordinateOptional";

const Crag = new EntitySchema<ICrag>({
  name: "crag",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
      nullable: true,
    },
    defaultZoom: {
      type: "int",
    },
    minZoom: {
      type: "int",
    },
  },
  embeddeds: {
    center: {
      schema: CoordinateOptional,
      prefix: "center_",
    },
  },
});

export default Crag;
