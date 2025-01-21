import Area, { type IArea } from "./Area.js";
import Boulder, { type IBoulder } from "./Boulder.js";
import Route, { type IRoute } from "./Route.js";
import Topo, { type ITopo } from "./Topo.js";

export type ITopogon = {
  id: number;
  label?: string;
  topo?: ITopo;
  data: string; // TODO: JSON or SVG string
  // Only can have one of these
  area?: IArea;
  boulder?: IBoulder;
  route?: IRoute;
};

interface Topogon
  extends Omit<ITopogon, "topo" | "area" | "boulder" | "route"> {
  topo: Topo;
  area?: Area;
  boulder?: Boulder;
  route?: Route;
}

class Topogon {
  constructor(data: ITopogon) {
    this.id = data.id;
    this.label = data.label;
    this.data = data.data;
    if (data.topo) {
      this.topo = new Topo(data.topo);
    }

    let relations = 0;
    if (data.area) {
      this.area = Area.build(data.area);
      relations += 1;
    }
    if (data.boulder) {
      this.boulder = Boulder.build(data.boulder);
      relations += 1;
    }
    if (data.route) {
      this.route = Route.build(data.route);
      relations += 1;
    }
    if (relations > 1) {
      throw new Error("Topogon can only have one of crag, boulder, or route");
    }
  }
}

export default Topogon;
