// import Coordinate, { CoordinateOptional } from "./Coordinate.js";
// import Area from "./Area.js";
// import Commentable from "./Commentable.js";
// import Trail from "./Trail.js";
// import Bounds from "./Bounds.js";

import type { IBounds } from "./Bounds.js";
import type { ICoordinate } from "./Coordinate.js";

export interface ICrag {
  id: number;
  name: string;
  description?: string;

  bounds?: IBounds;
  center?: ICoordinate;

  defaultZoom: number;
  minZoom: number;
  maxZoom: number;

  // Relationships
  // areas: Area[];
  // commentable?: Commentable;
  // trail?: Trail;
}

interface Crag extends ICrag {}
class Crag {
  constructor(data: ICrag) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;

    this.bounds = data.bounds;
    this.center = data.center;
    this.defaultZoom = data.defaultZoom;
    this.minZoom = data.minZoom;
    this.maxZoom = data.maxZoom;
  }
}

export default Crag;
