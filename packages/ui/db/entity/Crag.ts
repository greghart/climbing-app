import { cascadeOneToMany } from "@/db/cascadeOptions";
import { AreaSchema } from "@/db/entity/Area";
import { type ICrag } from "models";
import { EntitySchema } from "typeorm";
import Coordinate, { CoordinateSchema } from "./Coordinate";

export type CragSchema = ICrag & {
  areas?: AreaSchema[];
  center: CoordinateSchema;
};

const Crag = new EntitySchema<CragSchema>({
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
      nullable: true,
    },
    maxZoom: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    areas: {
      type: "one-to-many",
      inverseSide: "crag",
      target: "area",
      ...cascadeOneToMany,
    },
  },
  embeddeds: {
    center: {
      schema: Coordinate,
      prefix: "center_",
    },
  },
});

export default Crag;
