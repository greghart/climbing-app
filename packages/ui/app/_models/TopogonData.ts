import Label from "@/app/_models/Label";
import Line from "@/app/_models/Line";
import { makeObservable, observable } from "mobx";
import * as models from "models";

export default class TopogonData extends models.TopogonData {
  lines: Line[];
  labels: Label[];

  constructor(data: models.ITopogonData) {
    super(data);
    this.lines = data.lines.map((l) => new Line(l));
    this.labels = data.labels.map((l) => new Label(l));
    makeObservable(this, {
      lines: observable,
      labels: observable,
    });
  }
}
