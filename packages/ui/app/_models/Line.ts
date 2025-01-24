import { action, makeObservable, observable } from "mobx";
import { TopoData } from "models";

export default class Line extends TopoData.Line {
  constructor(line: TopoData.ILine) {
    super(line);
    makeObservable(this, {
      points: observable,
      color: observable,
      tension: observable,
      addPoint: action,
      popPoint: action,
    });
  }

  addPoint(p: TopoData.IPoint) {
    this.points.push(new TopoData.Point(p));
  }

  popPoint() {
    this.points = this.points.slice(0, -1);
  }
}
