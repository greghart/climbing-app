import { Column } from 'typeorm';
import { LatLngLiteral, LatLngTuple } from 'leaflet';

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

  toJSON() {
    return {
      lat: parseFloat(this.lat.toString()),
      lng: parseFloat(this.lng.toString())
    };
  }

}
