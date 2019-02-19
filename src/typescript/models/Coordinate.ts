import { Column } from 'typeorm';
import { LatLngLiteral, LatLngTuple } from 'leaflet';
import isNumber = require('lodash/isNumber');

interface Serialized {
  lat: number;
  lng: number;
}

function isValidCoordinate(coordinate: Partial<Coordinate>): coordinate is Coordinate {
  return isNumber(coordinate.lat) && isNumber(coordinate.lng);
}

export default class Coordinate {

  constructor(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
  }

  @Column('decimal')
  lat: number;

  @Column('decimal')
  lng: number;

  get literal(): LatLngLiteral {
    return {
      lat: this.lat,
      lng: this.lng,
    };
  }

  get tuple(): LatLngTuple {
    return [this.lat, this.lng];
  }

  toJSON(): Serialized {
    if (!(this.lat && this.lng)) {
      return null;
    }
    return {
      lat: parseFloat(this.lat.toString()),
      lng: parseFloat(this.lng.toString()),
    };
  }

  static fromJSON(json: Serialized) {
    return new this(json.lat, json.lng);
  }

}

export { isValidCoordinate };
