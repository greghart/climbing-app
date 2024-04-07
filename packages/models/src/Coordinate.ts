export interface ICoordinate {
  lat: number;
  lng: number;
}

interface Coordinate extends ICoordinate {}
class Coordinate {
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

  get tuple(): [number, number] {
    return [this.lat, this.lng];
  }
}

export default Coordinate;
