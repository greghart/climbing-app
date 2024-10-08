import { cascadeOneToMany } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { TrailLineSchema } from "@/db/entity/TrailLine";
import { type ITrail } from "models";
import { EntitySchema } from "typeorm";

export type TrailSchema = ITrail & {
  lines: TrailLineSchema[];
};

const Trail = new EntitySchema<TrailSchema>({
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
    },
  },
});

export default Trail;
