// import Boulder from "./Boulder.js";
// import Grade from "./Grade.js";
// import { cascadeManyToOne } from "../db/cascadeOptions.js";
// import Commentable from "./Commentable.js";
// import Coordinate, { CoordinateOptional } from "./Coordinate.js";
// import Photoable from "./Photoable.js";

import Boulder, { type IBoulder } from "./Boulder.js";
import type { ICommentable } from "./Commentable.js";
import type Coordinate from "./Coordinate.js";
import type { ICoordinateLiteral } from "./Coordinate.js";
import CoordinateOptional from "./CoordinateOptional.js";
import type { IGrade } from "./Grade.js";
import Grade from "./Grade.js";
import type { IPhotoable } from "./Photoable.js";

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
  coordinates?: ICoordinateLiteral;
  commentable?: ICommentable;
  photoable?: IPhotoable;
}

interface Route extends IRoute {}
class Route {
  boulder?: Boulder;
  coordinates?: Coordinate;
  grade?: Grade;

  static build(data: IRoute): Route {
    if (data instanceof Route) return data;
    return new Route(data);
  }

  constructor(data: IRoute) {
    this.id = data.id;
    this.name = data.name;
    this.length = data.length;
    this.description = data.description;
    this.firstAscent = data.firstAscent;
    this.gradeRaw = data.gradeRaw;
    if (data.grade) {
      this.grade = new Grade(data.grade);
    } else {
      this.grade = Grade.build(data.gradeRaw);
    }
    if (data.boulder) {
      this.boulder = new Boulder(data.boulder);
    }
    this.coordinates = CoordinateOptional.build(data.coordinates);
  }
}

export default Route;
