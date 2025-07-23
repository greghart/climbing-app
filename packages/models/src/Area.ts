import Boulder, { type IBoulder } from "./Boulder.js";
import type { ICommentable } from "./Commentable.js";
import Crag, { type ICrag } from "./Crag.js";
import type { IPhotoable } from "./Photoable.js";
import Polygon, { type IPolygon } from "./Polygon.js";
import type { ITimestamps } from "./Timestamps.js";
import Timestamps from "./Timestamps.js";

export type IArea = {
  id?: number;
  name: string;
  description?: string;

  // Associations
  crag?: ICrag; // EXAMPLE: domain, always belongs to a crag, in code, not always available
  polygon?: IPolygon;
  boulders?: IBoulder[];
  commentable?: ICommentable;
  photoable?: IPhotoable;
} & ITimestamps;

interface Area extends Omit<IArea, "center"> {}
class Area {
  crag?: Crag;
  polygon?: Polygon;
  boulders?: Boulder[];

  static build(data: IArea): Area {
    if (data instanceof Area) return data;
    return new Area(data);
  }

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
    Timestamps.mix(this, data);
  }
}

export default Area;
