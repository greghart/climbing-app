import { cascadeOneToMany } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { TrailLine } from "@/db/entity/TrailLine";
import { type ITrail } from "models";
import { EntitySchema } from "typeorm";

export type Trail = ITrail & {
  lines: TrailLine[];
};

const TrailSchema = new EntitySchema<Trail>({
  name: "trail",
  columns: {
    ...BaseColumnSchemaPart,
  },
  relations: {
    lines: {
      type: "one-to-many",
      inverseSide: "trail",
      target: "trail_line",
      ...cascadeOneToMany,
    },
    crag: {
      type: "one-to-one",
      target: "crag",
      inverseSide: "trail",
    },
  },
});

export default TrailSchema;
