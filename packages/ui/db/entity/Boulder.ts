import { Area, Coordinate, Polygon, Route } from "@/db";
import { cascadeManyToOne, cascadeOneToMany } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import CoordinateSchema from "@/db/entity/Coordinate";
import { type IBoulder } from "models";
import { EntitySchema } from "typeorm";

export type Boulder = IBoulder & {
  polygon?: Polygon;
  area?: Area;
  routes?: Route[];
  coordinates: Coordinate;
};

const BoulderSchema = new EntitySchema<Boulder>({
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
    commentable: {
      type: "one-to-one",
      nullable: true,
      target: "commentable",
      onDelete: "SET NULL",
      joinColumn: true,
    },
  },
  embeddeds: {
    coordinates: {
      schema: CoordinateSchema,
      prefix: "coordinates_",
    },
  },
});

export default BoulderSchema;
