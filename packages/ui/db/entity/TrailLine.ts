import { cascadeManyToOne } from "@/db/cascadeOptions";
import Coordinate from "@/db/entity/Coordinate";
import { TrailSchema } from "@/db/entity/Trail";
import { ILine } from "models";
import { EntitySchema } from "typeorm";

/**
 * A line of a trail
 *
 * Very similar to a regular trail, but kept sorted so we can easily squash
 * line 1 end/line 2 start.
 */
export type TrailLineSchema = ILine & {
  trail?: TrailSchema;
  order: number;
};

const TrailLine = new EntitySchema<TrailLineSchema>({
  name: "trail_line",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    order: {
      type: Number,
    },
  },
  embeddeds: {
    start: {
      schema: Coordinate,
      prefix: "start",
    },
    end: {
      schema: Coordinate,
      prefix: "end",
    },
  },
  relations: {
    trail: {
      type: "many-to-one",
      target: "trail",
      ...cascadeManyToOne,
    },
  },
  indices: [
    {
      name: "unique_trail_line_order",
      unique: true,
      columns: (obj) => {
        return [obj.trail, obj.order];
      },
    },
  ],
});

export default TrailLine;
