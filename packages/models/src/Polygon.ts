import type { IArea } from "./Area.js";
import Coordinate, { type ICoordinateLiteral } from "./Coordinate.js";

/**
 * Polygon to model a first class polygon
 */
export interface IPolygon {
  id?: number;

  // This column isn't necessary, but makes it slightly easier to track what
  // entity this polygon is describing.
  descriptor?: string;

  coordinates?: ICoordinateLiteral[];

  // Associations
  area?: IArea;
}

interface Polygon extends IPolygon {}

class Polygon {
  coordinates?: Coordinate[];

  constructor(data: IPolygon) {
    this.id = data.id;
    this.descriptor = data.descriptor;
    if (data.coordinates) {
      this.coordinates = data.coordinates.map(Coordinate.build);
    }
  }
}

export default Polygon;
