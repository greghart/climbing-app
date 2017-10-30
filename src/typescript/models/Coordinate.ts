import { Column } from 'typeorm';
import { LatLngLiteral, LatLngTuple } from 'leaflet';

export default class Coordinate {

  constructor(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
  }

  @Column()
  lat: number;

  @Column()
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

}
