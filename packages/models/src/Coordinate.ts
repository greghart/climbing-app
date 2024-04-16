import { isNumber, isObject } from "lodash-es";

export interface ICoordinateLiteral {
  lat: number;
  lng: number;
}

export type ICoordinateTuple = [number, number];

export type ICoordinate = ICoordinateLiteral | ICoordinateTuple;

class Coordinate {
  lat: number;
  lng: number;

  static build(data: ICoordinate) {
    if (isCoordinateLiteral(data)) {
      return new Coordinate(data.lat, data.lng);
    }
    return new Coordinate(data[0], data[1]);
  }

  constructor(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
  }

  get literal() {
    return {
      lat: this.lat,
      lng: this.lng,
    };
  }

  get tuple() {
    return [this.lat, this.lng];
  }

  toJSON() {
    return this.literal;
  }
}

export function isCoordinateLiteral(
  coordinate: ICoordinate
): coordinate is ICoordinateLiteral {
  return "lat" in coordinate && "lng" in coordinate;
}

export default Coordinate;
