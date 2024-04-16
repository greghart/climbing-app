import { cascadeOneToMany } from "@/db/cascadeOptions";
import { PolygonCoordinateSchema } from "@/db/entity/PolygonCoordinate";
import { type IPolygon } from "models";
import { EntitySchema } from "typeorm";

export interface PolygonSchema extends Omit<IPolygon, "coordinates"> {
  coordinates: PolygonCoordinateSchema[];
}

const Polygon = new EntitySchema<PolygonSchema>({
  name: "polygon",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
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
