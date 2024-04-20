import { cascadeManyToOne } from "@/db/cascadeOptions";
import { type AreaSchema } from "@/db/entity/Area";
import Coordinate, { CoordinateSchema } from "@/db/entity/Coordinate";
import { type PolygonSchema } from "@/db/entity/Polygon";
import { type IBoulder } from "models";
import { EntitySchema } from "typeorm";

export type BoulderSchema = IBoulder & {
  polygon?: PolygonSchema;
  area?: AreaSchema;
  coordinates: CoordinateSchema;
};

const Boulder = new EntitySchema<BoulderSchema>({
  name: "boulder",
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
  },
  relations: {
    area: {
      type: "many-to-one",
      target: "area",
      ...cascadeManyToOne,
    },
    polygon: {
      type: "one-to-one",
      target: "polygon",
      joinColumn: true,
      onDelete: "SET NULL",
      cascade: ["insert", "update"],
    },
  },
  embeddeds: {
    coordinates: {
      schema: Coordinate,
      prefix: "coordinates_",
    },
  },
});

export default Boulder;
