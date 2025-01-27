import { makeObservable, observable } from "mobx";
import { TopoData } from "models";

export default class Label extends TopoData.Label {
  constructor(data: TopoData.ILabel) {
    super(data);
    this.direction = data.direction || "none";
    makeObservable(this, {
      point: observable,
      color: observable,
      fill: observable,
      direction: observable,
    });
  }

  move(x: number, y: number) {
    this.point.x = x;
    this.point.y = y;
  }
}
