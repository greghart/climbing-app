export interface ICoordinateOptional {
  lat?: number;
  lng?: number;
}

interface CoordinateOptional extends ICoordinateOptional {}
class CoordinateOptional {
  constructor(lat?: number, lng?: number) {
    this.lat = lat;
    this.lng = lng;
  }

  get literal() {
    if (this.lat && this.lng) {
      return {
        lat: this.lat,
        lng: this.lng,
      };
    }
    return undefined;
  }

  get tuple() {
    if (this.lat && this.lng) {
      return [this.lat, this.lng] as [number, number];
    }
    return undefined;
  }
}

export default CoordinateOptional;
