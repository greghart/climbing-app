import { type GradingSystemSchema } from "@/db/entity/GradingSystem";
import { RouteSchema } from "@/db/entity/Route";
import { IGrade } from "models";
import { EntitySchema } from "typeorm";

export type GradeSchema = IGrade & {
  route?: RouteSchema[];
  system?: GradingSystemSchema;
};

const Grade = new EntitySchema<GradeSchema>({
  name: "grade",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
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

export default Grade;
