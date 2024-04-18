import Area, { type IArea } from "./Area.js";
import Coordinate, { type ICoordinate } from "./Coordinate.js";
import Polygon, { type IPolygon } from "./Polygon.js";

export interface IBoulder {
  id?: number;
  name: string;
  description?: string;
  // Just a single location of a boulder
  coordinates: ICoordinate;
  area?: IArea;
  // Polygon coordinates of an outline of a boulder, optional
  polygon?: IPolygon;
}

interface Boulder extends Omit<IBoulder, "center"> {}
class Boulder {
  coordinates: Coordinate;
  area?: Area;
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
  }
}

export default Boulder;
