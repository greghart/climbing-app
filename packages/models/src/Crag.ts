// import Coordinate, { CoordinateOptional } from "./Coordinate.js";
// import Commentable from "./Commentable.js";
// import Trail from "./Trail.js";
import Area, { type IArea } from "./Area.js";
import Bounds, { type IBounds } from "./Bounds.js";
import type { ICommentable } from "./Commentable.js";
import Coordinate, { type ICoordinate } from "./Coordinate.js";

export interface ICrag {
  id?: number; // IDs are tricky -- schema wise they always exist, but not till we save
  name: string;
  description?: string;

  bounds?: IBounds;
  center: ICoordinate;

  defaultZoom: number;
  minZoom?: number;
  maxZoom?: number;

  // Relationships
  areas?: IArea[];
  commentable?: ICommentable;
  // trail?: Trail;
}

interface Crag extends Omit<ICrag, "center"> {}
class Crag {
  bounds?: Bounds;
  center: Coordinate; // We map embedded entities with nullable columns to a nullable property.
  areas?: Area[];

  constructor(data: ICrag) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;

    this.bounds = Bounds.build(data.bounds);
    this.center = Coordinate.build(data.center);
    if (data.areas) {
      this.areas = data.areas.map((area) => new Area(area));
    }

    this.defaultZoom = data.defaultZoom;
    this.minZoom = data.minZoom;
    this.maxZoom = data.maxZoom;
  }
}

export default Crag;
