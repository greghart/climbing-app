// import Coordinate, { CoordinateOptional } from "./Coordinate.js";
// import Area from "./Area.js";
// import Commentable from "./Commentable.js";
// import Trail from "./Trail.js";
// import Bounds from "./Bounds.js";

import Bounds from "./Bounds.js";
import type { IBounds } from "./Bounds.js";
import Coordinate, { type ICoordinate } from "./Coordinate.js";

export interface ICrag {
  id?: number; // IDs are tricky -- schema wise they always exist, but not till we save
  name: string;
  description?: string;

  bounds?: IBounds;
  center: ICoordinate;

  defaultZoom: number;
  minZoom: number;
  maxZoom: number;

  // Relationships
  // areas: Area[];
  // commentable?: Commentable;
  // trail?: Trail;
}

interface Crag extends Omit<ICrag, "center"> {}
class Crag {
  bounds?: Bounds;
  center: Coordinate; // We map embedded entities with nullable columns to a nullable property.

  constructor(data: ICrag) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;

    if (data.bounds) {
      this.bounds = new Bounds(data.bounds);
    }
    this.center = new Coordinate(data.center.lat, data.center.lng);

    this.defaultZoom = data.defaultZoom;
    this.minZoom = data.minZoom;
    this.maxZoom = data.maxZoom;
  }
}

export default Crag;
