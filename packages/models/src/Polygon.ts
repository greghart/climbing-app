import type { ICoordinate } from "./Coordinate.js";
import Coordinate from "./Coordinate.js";

/**
 * Polygon to model a first class polygon
 */
export interface IPolygon {
  id?: number;

  // This column isn't necessary, but makes it slightly easier to track what
  // entity this polygon is describing.
  descriptor?: string;

  coordinates?: ICoordinate[];
}

interface Polygon extends IPolygon {}

class Polygon {
  coordinates: Coordinate[];

  constructor(data: IPolygon) {
    this.id = data.id;
    this.descriptor = data.descriptor;
    this.coordinates = (data.coordinates || []).map(Coordinate.build);
  }
}

export default Polygon;
