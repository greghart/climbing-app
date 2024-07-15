import { cascadeOneToMany } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { PolygonCoordinateSchema } from "@/db/entity/PolygonCoordinate";
import { type IPolygon } from "models";
import { EntitySchema } from "typeorm";

export type PolygonSchema = IPolygon & {
  coordinates: PolygonCoordinateSchema[];
};

const Polygon = new EntitySchema<PolygonSchema>({
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
  },
});

export default Polygon;
