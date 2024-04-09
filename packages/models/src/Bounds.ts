import Coordinate, { type ICoordinate } from "./Coordinate.js";
import { type ICrag } from "./Crag.js";

/**
 * Rectangle bounds entity for crags
 */
export interface IBounds {
  id: number;
  topLeft: ICoordinate;
  bottomRight: ICoordinate;
  crag: ICrag;
}

interface Bounds extends IBounds {}
class Bounds {
  constructor(data: IBounds) {
    this.id = data.id;
    this.topLeft = data.topLeft;
    this.bottomRight = data.bottomRight;
    this.crag = data.crag;
  }

  get center(): Coordinate {
    return new Coordinate(
      (this.topLeft.lat + this.bottomRight.lat) / 2,
      (this.topLeft.lng + this.bottomRight.lng) / 2
    );
  }
}

export default Bounds;
