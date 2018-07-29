import { Column } from 'typeorm';
import { LatLngLiteral, LatLngTuple } from 'leaflet';

interface Serialized {
  lat: number;
  lng: number;
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
      lng: this.lng
    };
  }

  get tuple(): LatLngTuple {
    return [this.lat, this.lng];
  }

  toJSON(): Serialized {
    return {
      lat: parseFloat(this.lat.toString()),
      lng: parseFloat(this.lng.toString())
    };
  }

  static fromJSON(json: Serialized) {
    return new this(json.lat, json.lng);
  }

}
