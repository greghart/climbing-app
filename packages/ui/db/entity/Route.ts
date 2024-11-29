import { Boulder, CoordinateOptional, Grade } from "@/db";
import { cascadeManyToOne } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { type IRoute } from "models";
import { EntitySchema } from "typeorm";
import CoordinateOptionalSchema from "./CoordinateOptional";

export type Route = IRoute & {
  coordinates?: CoordinateOptional;
  boulder?: Boulder;
  grade?: Grade;
};

const RouteSchema = new EntitySchema<Route>({
  name: "route",
  columns: {
    ...BaseColumnSchemaPart,
    name: {
      type: String,
    },
    length: {
      type: Number,
      nullable: true,
    },
    description: {
      type: String,
      nullable: true,
    },
    firstAscent: {
      type: String,
      nullable: true,
    },
    gradeRaw: {
      type: String,
      nullable: true,
    },
  },
  relations: {
    boulder: {
      type: "many-to-one",
      target: "boulder",
      ...cascadeManyToOne,
    },
    grade: {
      type: "many-to-one",
      target: "grade",
      joinColumn: true,
      onDelete: "RESTRICT",
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
      schema: CoordinateOptionalSchema,
      prefix: "coordinates_",
    },
  },
});

export default RouteSchema;
