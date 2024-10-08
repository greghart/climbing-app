import { cascadeManyToOne } from "@/db/cascadeOptions";
import { ICoordinateLiteral, Polygon } from "models";
import { EntitySchema } from "typeorm";

/**
 * A coordinate of a polygon
 *
 * Very similar to a regular coordinate, but has an order which we need
 * for persisting these.
 */
export interface PolygonCoordinateSchema extends ICoordinateLiteral {
  id?: number;
  order: number;
  polygon?: Polygon;
}

const PolygonCoordinate = new EntitySchema<PolygonCoordinateSchema>({
  name: "polygon_coordinate",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    order: {
      type: Number,
    },
    lat: {
      type: "decimal",
    },
    lng: {
      type: "decimal",
    },
  },
  relations: {
    polygon: {
      type: "many-to-one",
      target: "polygon",
      ...cascadeManyToOne,
    },
  },
  indices: [
    {
      name: "unique_polygon_order",
      unique: true,
      columns: (obj) => {
        return [obj.polygon, obj.order];
      },
    },
  ],
});

export default PolygonCoordinate;
