import { cascadeManyToOne } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { type BoulderSchema } from "@/db/entity/Boulder";
import CoordinateOptional from "@/db/entity/CoordinateOptional";
import { type GradeSchema } from "@/db/entity/Grade";
import { ICoordinateOptional, type IRoute } from "models";
import { EntitySchema } from "typeorm";

export type RouteSchema = IRoute & {
  coordinates?: ICoordinateOptional;
  boulder?: BoulderSchema;
  grade?: GradeSchema;
};

const Route = new EntitySchema<RouteSchema>({
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
      schema: CoordinateOptional,
      prefix: "coordinates_",
    },
  },
});

export default Route;
