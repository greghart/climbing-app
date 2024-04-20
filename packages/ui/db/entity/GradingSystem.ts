import { GradeSchema } from "@/db/entity/Grade";
import { IGradingSystem, GradingSystemType } from "models";
import { EntitySchema } from "typeorm";

export type GradingSystemSchema = IGradingSystem & {
  grades?: GradeSchema[];
  type: string; // TODO: SQLite does not support enums
};

const GradingSystem = new EntitySchema<GradingSystemSchema>({
  name: "grading_system",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    type: {
      type: String,
      // type: "enum", TODO: SQLite does not support enums
      // enum: GradingSystemType,
    },
  },
  relations: {
    grades: {
      type: "one-to-many",
      target: "grade",
    },
  },
});

export default GradingSystem;
