import { GradingSystem, Route } from "@/db";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { IGrade } from "models";
import { EntitySchema } from "typeorm";

export type Grade = IGrade & {
  route?: Route[];
  system?: GradingSystem;
};

const GradeSchema = new EntitySchema<Grade>({
  name: "grade",
  columns: {
    ...BaseColumnSchemaPart,
    name: {
      type: String,
    },
    order: {
      type: Number,
    },
  },
  relations: {
    routes: {
      type: "one-to-many",
      target: "route",
      inverseSide: "grade",
    },
    system: {
      type: "many-to-one",
      target: "grading_system",
      joinColumn: true,
      onDelete: "CASCADE",
      cascade: ["insert", "update"],
    },
  },
});

export default GradeSchema;
