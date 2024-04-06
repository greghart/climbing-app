// import Coordinate, { CoordinateOptional } from "./Coordinate.js";
// import Area from "./Area.js";
// import Commentable from "./Commentable.js";
// import Trail from "./Trail.js";
// import Bounds from "./Bounds.js";

export default class Crag {
  id: number;
  name: string;
  description?: string;

  // bounds?: Bounds;
  // _center?: CoordinateOptional;
  // get center(): Coordinate | undefined {
  //   if (this._center.lat && this._center.lng) {
  //     return new Coordinate(this._center.lat, this._center.lng);
  //   }
  // }

  defaultZoom: number;
  minZoom: number;
  maxZoom: number;

  // Relationships
  // areas: Area[];
  // commentable?: Commentable;
  // trail?: Trail;

  toJSON() {
    return Object.assign({}, this, {
      // center: this.center,
    });
  }
}
