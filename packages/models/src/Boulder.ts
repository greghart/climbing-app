import Area, { type IArea } from "./Area.js";
import type { ICommentable } from "./Commentable.js";
import Coordinate, { type ICoordinateLiteral } from "./Coordinate.js";
import Polygon, { type IPolygon } from "./Polygon.js";
import Route, { type IRoute } from "./Route.js";

export interface IBoulder {
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
}

interface Boulder extends Omit<IBoulder, "center"> {}
class Boulder {
  coordinates: Coordinate;
  area?: Area;
  routes?: Route[];
  polygon?: Polygon;

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
    if (data.routes) {
      this.routes = data.routes.map((route) => new Route(route));
    }
  }
}

export default Boulder;
