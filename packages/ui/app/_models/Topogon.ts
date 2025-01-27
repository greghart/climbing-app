import TopogonData from "@/app/_models/TopogonData";
import { makeObservable, observable } from "mobx";
import * as models from "models";

export default class Topogon extends models.Topogon {
  data: TopogonData;

  constructor(topogon: models.ITopogon) {
    super(topogon);
    this.data = new TopogonData(topogon.data || { lines: [], labels: [] });
    makeObservable(this, {
      data: observable,
      label: observable,
    });
  }
}
