import Coordinate from "./Coordinate.js";

export interface ICoordinateOptional {
  lat?: number;
  lng?: number;
}

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
