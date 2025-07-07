import { cascadeManyToOne } from "@/db/cascadeOptions";
import CoordinateSchema from "@/db/entity/Coordinate";
import { Trail } from "@/db/entity/Trail";
import { ILine } from "models";
import { EntitySchema } from "typeorm";

/**
 * A line of a trail
 *
 * Very similar to a regular trail, but kept sorted so we can easily squash
 * line 1 end/line 2 start.
 */
export type TrailLine = ILine & {
  trail?: Trail;
  order: number;
};

const TrailLineSchema = new EntitySchema<TrailLine>({
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
      schema: CoordinateSchema,
      prefix: "start_",
    },
    end: {
      schema: CoordinateSchema,
      prefix: "end_",
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

export default TrailLineSchema;
