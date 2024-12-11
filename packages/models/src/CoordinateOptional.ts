import Coordinate from "./Coordinate.js";

export interface ICoordinateOptional {
  lat?: number;
  lng?: number;
}

// CoordinateOptional should probably be called CoordinateNullable.
// Useful when embedded on entities that won't have a coordinate.
// TODO: Leaky abstraction, since specifically TypeORM doesn't have a way to
// handle this directly with embeds.
interface CoordinateOptional extends ICoordinateOptional {}
class CoordinateOptional {
  static build(data?: ICoordinateOptional) {
    if (data && data.lat && data.lng) {
      return new Coordinate(data.lat, data.lng);
    }
    return undefined;
  }
}

export default CoordinateOptional;
