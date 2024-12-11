import { cascadeOneToMany } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { type PolygonCoordinate } from "@/db/entity/PolygonCoordinate";
import { type IPolygon } from "models";
import { EntitySchema } from "typeorm";

export type Polygon = IPolygon & {
  coordinates: PolygonCoordinate[];
};

const PolygonSchema = new EntitySchema<Polygon>({
  name: "polygon",
  columns: {
    ...BaseColumnSchemaPart,
    descriptor: {
      type: String,
    },
  },
  relations: {
    coordinates: {
      type: "one-to-many",
      inverseSide: "polygon",
      target: "polygon_coordinate",
      ...cascadeOneToMany,
    },
    area: {
      type: "one-to-one",
      target: "area",
    },
  },
});

export default PolygonSchema;
