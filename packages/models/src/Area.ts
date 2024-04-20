import Boulder, { type IBoulder } from "./Boulder.js";
import Crag, { type ICrag } from "./Crag.js";
import Polygon, { type IPolygon } from "./Polygon.js";

export interface IArea {
  id?: number;
  name: string;
  description?: string;
  crag?: ICrag; // EXAMPLE: domain, always belongs to a crag, in code, not always available
  polygon?: IPolygon;
  boulders?: IBoulder[];
}

interface Area extends Omit<IArea, "center"> {}
class Area {
  crag?: Crag;
  polygon?: Polygon;
  boulders?: Boulder[];

  constructor(data: IArea) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;

    if (data.crag) {
      this.crag = new Crag(data.crag);
    }
    if (data.polygon) {
      this.polygon = new Polygon(data.polygon);
    }
    if (data.boulders) {
      this.boulders = data.boulders.map((boulder) => new Boulder(boulder));
    }
  }
}

export default Area;
