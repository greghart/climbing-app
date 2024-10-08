import Coordinate, { type ICoordinateLiteral } from "./Coordinate.js";
import type { ITrail } from "./Trail.js";
import Trail from "./Trail.js";

/**
 * Line to model a drawn lat/lng line
 */
export interface ILine {
  id?: number;

  start: ICoordinateLiteral;
  end: ICoordinateLiteral;

  // Associations
  trail?: ITrail;
}

interface Line extends ILine {}

class Line {
  start: Coordinate;
  end: Coordinate;
  trail?: Trail;

  constructor(data: ILine) {
    this.id = data.id;
    this.start = Coordinate.build(data.start);
    this.end = Coordinate.build(data.end);
    this.trail = data.trail ? new Trail(data.trail) : undefined;
  }
}

export default Line;
