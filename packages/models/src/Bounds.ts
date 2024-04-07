import { type ICoordinate } from "./Coordinate.js";
import { type ICrag } from "./Crag.js";

/**
 * Rectangle bounds entity for crags
 */
export interface IBounds {
  id: number;
  topLeft: ICoordinate;
  bottomRight: ICoordinate;
  crag: ICrag;
  center: ICoordinate;
}

interface Bounds extends IBounds {}
class Bounds {}

export default Bounds;
