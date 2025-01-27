import { action, makeObservable, observable } from "mobx";
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
      move: action,
    });
  }

  move(offsetX: number, offsetY: number) {
    this.point = new TopoData.Point({
      x: this.point.x + offsetX,
      y: this.point.y + offsetY,
    });
  }
}
