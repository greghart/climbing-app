import Line from "@/app/_models/Line";
import { makeObservable, observable } from "mobx";
import * as models from "models";

export default class TopogonData extends models.TopogonData {
  lines: Line[];

  constructor(data: models.ITopogonData) {
    super(data);
    this.lines = data.lines.map((l) => new Line(l));
    makeObservable(this, {
      lines: observable,
    });
  }
}
