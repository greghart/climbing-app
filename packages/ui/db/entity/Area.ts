import { cascadeManyToOne } from "@/db/cascadeOptions";
import { type CragSchema } from "@/db/entity/Crag";
import { type PolygonSchema } from "@/db/entity/Polygon";
import { type IArea } from "models";
import { EntitySchema } from "typeorm";

export interface AreaSchema extends Omit<IArea, "crag" | "polygon"> {
  polygon?: PolygonSchema;
  crag?: CragSchema;
}

const Area = new EntitySchema<AreaSchema>({
  name: "area",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
      nullable: true,
    },
  },
  relations: {
    crag: {
      type: "many-to-one",
      target: "crag",
      ...cascadeManyToOne,
    },
    polygon: {
      type: "one-to-one",
      target: "polygon",
      joinColumn: true,
      onDelete: "SET NULL",
      cascade: ["insert", "update"],
    },
  },
});

export default Area;
