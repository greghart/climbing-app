import { pointsToLine } from "@/app/_components/photos/topos/util";
import { action, computed, makeObservable, observable } from "mobx";
import { TopoData } from "models";

export default class Line extends TopoData.Line {
  constructor(line: TopoData.ILine) {
    super(line);
    makeObservable(this, {
      points: observable,
      color: observable,
      tension: observable,
      konvaPoints: computed,
      movePoints: action,
      setPointsFromKonva: action,
      addPoint: action,
      popPoint: action,
    });
  }

  get konvaPoints() {
    return pointsToLine(...this.points);
  }

  movePoints(offset: { x: number; y: number }) {
    (this.points as any).replace(
      this.points.map(
        (p) =>
          new TopoData.Point({
            x: p.x + offset.x,
            y: p.y + offset.y,
          })
      )
    );
  }

  setPointsFromKonva(p: number[]) {
    let points = [] as TopoData.Point[];
    for (let i = 0; i < p.length; i += 2) {
      points.push(new TopoData.Point({ x: p[i], y: p[i + 1] }));
    }
    this.points = points;
  }

  addPoint(p: TopoData.IPoint) {
    this.points.push(new TopoData.Point(p));
  }

  popPoint() {
    this.points = this.points.slice(0, -1);
  }
}
