import Area, { type IArea } from "./Area.js";
import Bounds, { type IBounds } from "./Bounds.js";
import { type ICommentable } from "./Commentable.js";
import Coordinate, { type ICoordinate } from "./Coordinate.js";
import Parking, { type IParking } from "./Parking.js";
import { type IPhotoable } from "./Photoable.js";
import Trail, { type ITrail } from "./Trail.js";

export interface ICrag {
  id?: number; // IDs are tricky -- schema wise they always exist, but not till we save
  name: string;
  description?: string;

  bounds?: IBounds;
  center: ICoordinate;

  defaultZoom: number;
  minZoom?: number;
  maxZoom?: number;

  // Associations
  parking?: IParking;
  areas?: IArea[];
  commentable?: ICommentable;
  photoable?: IPhotoable;
  trail?: ITrail;
}

interface Crag extends Omit<ICrag, "center" | "parking"> {}
class Crag {
  bounds?: Bounds; // We map embedded entities with nullable columns to a nullable property.
  parking?: Parking;
  center: Coordinate;
  areas: Area[];
  trail?: Trail;

  static build(data: ICrag) {
    if (data instanceof Crag) return data;

    return new Crag(data);
  }

  constructor(data: ICrag) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;

    this.bounds = Bounds.build(data.bounds);
    this.center = Coordinate.build(data.center);
    this.areas = (data.areas || []).map((area) => new Area(area));
    if (data.trail) {
      this.trail = new Trail(data.trail);
    }
    if (data.parking) {
      this.parking = new Parking(data.parking);
    }

    this.defaultZoom = data.defaultZoom;
    this.minZoom = data.minZoom;
    this.maxZoom = data.maxZoom;
  }
}

export default Crag;
