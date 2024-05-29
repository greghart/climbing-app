// import Boulder from "./Boulder.js";
// import Grade from "./Grade.js";
// import { cascadeManyToOne } from "../db/cascadeOptions.js";
// import Commentable from "./Commentable.js";
// import Coordinate, { CoordinateOptional } from "./Coordinate.js";
// import Photoable from "./Photoable.js";

import Boulder, { type IBoulder } from "./Boulder.js";
import type Coordinate from "./Coordinate.js";
import CoordinateOptional, {
  type ICoordinateOptional,
} from "./CoordinateOptional.js";
import Grade from "./Grade.js";
import type { IGrade } from "./Grade.js";

export interface IRoute {
  id?: number;
  name: string;
  length?: number; // in feet
  description?: string;
  firstAscent?: string;
  // TODO Formalize route type, and decide normalized safe way to constrain
  // boulders to only have bouldering grades
  gradeRaw: string;
  grade?: IGrade;
  boulder?: IBoulder;
  // Location of the route if any, this will be setup on a polygon of the boulder
  coordinates?: ICoordinateOptional;
  // commentable?: Commentable;
  // photoable?: Photoable;
}

interface Route extends IRoute {}
class Route {
  boulder?: Boulder;
  coordinates?: Coordinate;
  grade?: Grade;

  constructor(data: IRoute) {
    this.id = data.id;
    this.name = data.name;
    this.length = data.length;
    this.description = data.description;
    this.firstAscent = data.firstAscent;
    this.gradeRaw = data.gradeRaw;
    if (data.grade) {
      this.grade = new Grade(data.grade);
    }
    if (data.boulder) {
      this.boulder = new Boulder(data.boulder);
    }
    this.coordinates = CoordinateOptional.build(data.coordinates);
  }
}

export default Route;