import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { Grade } from "@/db/entity/Grade";
import { IGradingSystem } from "models";
import { EntitySchema } from "typeorm";

export type GradingSystem = IGradingSystem & {
  grades?: Grade[];
  type: string; // TODO: SQLite does not support enums
};

const GradingSystemSchema = new EntitySchema<GradingSystem>({
  name: "grading_system",
  columns: {
    ...BaseColumnSchemaPart,
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

export default GradingSystemSchema;
