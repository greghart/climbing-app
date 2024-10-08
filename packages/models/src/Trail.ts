import Crag, { type ICrag } from "./Crag.js";
import type { ILine } from "./Line.js";
import Line from "./Line.js";

export interface ITrail {
  id?: number;
  crag?: ICrag;
  lines?: ILine[];
}

interface Trail extends ITrail {}
class Trail {
  crag?: Crag;
  lines: Line[];

  constructor(data: ITrail) {
    this.id = data.id;
    this.lines = (data.lines || []).map((line) => new Line(line));

    if (data.crag) {
      this.crag = new Crag(data.crag);
    }
  }
}

export default Trail;
