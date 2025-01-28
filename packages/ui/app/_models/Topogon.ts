import TopogonData from "@/app/_models/TopogonData";
import { TopogonEntityKeys } from "@/db/entity/Topogon";
import { makeObservable, observable } from "mobx";
import * as models from "models";

export default class Topogon
  extends models.Topogon
  implements TopogonEntityKeys
{
  data: TopogonData;
  routeId: number | null;
  boulderId: number | null;
  areaId: number | null;

  constructor(topogon: models.ITopogon & TopogonEntityKeys) {
    super(topogon);
    this.data = new TopogonData(topogon.data || { lines: [], labels: [] });
    this.routeId = topogon.routeId;
    this.boulderId = topogon.boulderId;
    this.areaId = topogon.areaId;
    makeObservable(this, {
      data: observable,
      label: observable,
      routeId: observable,
      boulderId: observable,
      areaId: observable,
    });
  }
}
