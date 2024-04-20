import GradingSystem, { type IGradingSystem } from "./GradingSystem.js";
import Route, { type IRoute } from "./Route.js";
// import GradingSystem from "./GradingSystem.js";

export interface IGrade {
  id?: number;
  name: string;
  // Order difficulties within a grade type
  order: number;
  routes?: IRoute[];
  system?: IGradingSystem;
}

interface Grade extends IGrade {}
class Grade {
  routes?: Route[];
  system?: GradingSystem;

  constructor(data: IGrade) {
    this.id = data.id;
    this.name = data.name;
    this.order = data.order;
    if (data.routes) {
      this.routes = data.routes.map((route) => new Route(route));
    }
    if (data.system) {
      this.system = new GradingSystem(data.system);
    }
  }
}

export default Grade;
