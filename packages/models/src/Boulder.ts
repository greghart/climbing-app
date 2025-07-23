import Area, { type IArea } from "./Area.js";
import type { ICommentable } from "./Commentable.js";
import Coordinate, { type ICoordinateLiteral } from "./Coordinate.js";
import type { IPhotoable } from "./Photoable.js";
import Polygon, { type IPolygon } from "./Polygon.js";
import Route, { type IRoute } from "./Route.js";
import type { ITimestamps } from "./Timestamps.js";
import Timestamps from "./Timestamps.js";

export type IBoulder = {
  id?: number;
  name: string;
  description?: string;
  // Just a single location of a boulder
  coordinates: ICoordinateLiteral;
  area?: IArea;
  routes?: IRoute[];
  // Polygon coordinates of an outline of a boulder, optional
  polygon?: IPolygon;
  commentable?: ICommentable;
  photoable?: IPhotoable;
} & ITimestamps;

interface Boulder extends Omit<IBoulder, "center"> {}
class Boulder {
  coordinates: Coordinate;
  area?: Area;
  routes: Route[];
  polygon?: Polygon;

  static build(data: IBoulder): Boulder {
    if (data instanceof Boulder) return data;
    return new Boulder(data);
  }

  constructor(data: IBoulder) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;

    this.coordinates = Coordinate.build(data.coordinates);

    if (data.area) {
      this.area = new Area(data.area);
    }
    if (data.polygon) {
      this.polygon = new Polygon(data.polygon);
    }
    this.routes = (data.routes || []).map((route) => new Route(route));
    Timestamps.mix(this, data);
  }

  _clockwiseRoutes?: Route[];

  get clockwiseRoutes() {
    if (this._clockwiseRoutes) return this._clockwiseRoutes;
    this._clockwiseRoutes = this.routes.sort(_compare(this.coordinates));
  }
}

/**
 * Compare routes to boulder center to sort by clockwise position starting from 12 o'clock
 */
function _compare(center: ICoordinateLiteral) {
  return (a: IRoute, b: IRoute) => {
    // Corner case quadrant checking first for perf
    // A is right hemisphere, B is left
    if (
      a.coordinates!.lng - center.lng >= 0 &&
      b.coordinates!.lng - center.lng < 0
    ) {
      return 1;
    }
    // A is left hemisphere, B is right
    if (
      a.coordinates!.lng - center.lng < 0 &&
      b.coordinates!.lng - center.lng >= 0
    ) {
      return -1;
    }
    // Both on middle line?!?! (unlikely)
    if (
      a.coordinates!.lng - center.lng == 0 &&
      b.coordinates!.lng - center.lng == 0
    ) {
      if (
        a.coordinates!.lat - center.lat >= 0 ||
        b.coordinates!.lat - center.lat >= 0
      ) {
        return a.coordinates!.lat - b.coordinates!.lat;
      }
      return b.coordinates!.lat - a.coordinates!.lat;
    }

    // compute the cross product of vectors (center -> a) x (center -> b)
    const det =
      (a.coordinates!.lng - center.lng) * (b.coordinates!.lat - center.lat) -
      (b.coordinates!.lng - center.lng) * (a.coordinates!.lat - center.lat);
    return det;
  };
}

export default Boulder;
