import { cascadeManyToOne, cascadeOneToMany } from "@/db/cascadeOptions";
import { type AreaSchema } from "@/db/entity/Area";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import Coordinate, { CoordinateSchema } from "@/db/entity/Coordinate";
import { type PolygonSchema } from "@/db/entity/Polygon";
import { type RouteSchema } from "@/db/entity/Route";
import { type IBoulder } from "models";
import { EntitySchema } from "typeorm";

export type BoulderSchema = IBoulder & {
  polygon?: PolygonSchema;
  area?: AreaSchema;
  routes?: RouteSchema[];
  coordinates: CoordinateSchema;
};

const Boulder = new EntitySchema<BoulderSchema>({
  name: "boulder",
  columns: {
    ...BaseColumnSchemaPart,
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
    routes: {
      type: "one-to-many",
      inverseSide: "boulder",
      target: "route",
      ...cascadeOneToMany,
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
