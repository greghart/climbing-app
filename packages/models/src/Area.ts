import Crag, { type ICrag } from "./Crag.js";
import type { IPolygon } from "./Polygon.js";
import Polygon from "./Polygon.js";

export interface IArea {
  id?: number;
  name: string;
  description?: string;
  crag?: ICrag; // EXAMPLE: domain, always belongs to a crag, in code, not always available
  polygon?: IPolygon;

  // Relationships
  // @ManyToOne((type) => Crag, (crag) => crag.areas, cascadeManyToOne)
  // crag: Crag;
  // @OneToMany((type) => Boulder, (boulder) => boulder.area, cascadeOneToMany)
  // boulders: Boulder[];

  // @OneToOne((type) => Commentable, { nullable: true, onDelete: "SET NULL" })
  // @JoinColumn()
  // commentable?: Commentable | null;

  // Areas must be defined with a polygon
  // @OneToOne((type) => Polygon, {
  //   nullable: false,
  //   onDelete: "SET NULL",
  //   cascade: ["insert", "update"],
  // })
  // @JoinColumn()
  // polygon: Polygon;
}

interface Area extends Omit<IArea, "center"> {}
class Area {
  crag?: Crag;
  polygon?: Polygon;

  constructor(data: IArea) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;

    if (data.crag) {
      this.crag = new Crag(data.crag);
    }
    if (data.polygon) {
      this.polygon = new Polygon(data.polygon);
    }
  }
}

export default Area;
