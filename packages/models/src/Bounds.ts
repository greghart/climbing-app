import Coordinate, {
  isCoordinateLiteral,
  type ICoordinateLiteral,
} from "./Coordinate.js";

/**
 * Rectangle bounds entity for crags
 * upper left and bottom right for consistency with backend and libs.
 */
export interface IBounds {
  topLeft: ICoordinateLiteral;
  bottomRight: ICoordinateLiteral;
}

interface Bounds extends IBounds {}
class Bounds {
  topLeft: Coordinate;
  bottomRight: Coordinate;

  static build(data?: IBounds) {
    if (isBounds(data)) {
      return new Bounds(data);
    }
  }

  constructor(data: IBounds) {
    this.topLeft = Coordinate.build(data.topLeft);
    this.bottomRight = Coordinate.build(data.bottomRight);
  }

  get center(): Coordinate | undefined {
    return new Coordinate(
      (this.topLeft.lat + this.bottomRight.lat) / 2,
      (this.topLeft.lng + this.bottomRight.lng) / 2
    );
  }
}

export function isBounds(value: any): value is IBounds {
  return (
    typeof value == "object" &&
    "topLeft" in value &&
    "bottomRight" in value &&
    isCoordinateLiteral(value.topLeft) &&
    isCoordinateLiteral(value.bottomRight)
  );
}

export default Bounds;
