import { cascadeManyToOne, cascadeOneToMany } from "@/db/cascadeOptions";
import { BoulderSchema } from "@/db/entity/Boulder";
import { type CragSchema } from "@/db/entity/Crag";
import { type PolygonSchema } from "@/db/entity/Polygon";
import { type IArea } from "models";
import { EntitySchema } from "typeorm";

export type AreaSchema = IArea & {
  polygon?: PolygonSchema;
  crag?: CragSchema;
  boulders?: BoulderSchema[];
};

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
    boulders: {
      type: "one-to-many",
      inverseSide: "area",
      target: "boulder",
      ...cascadeOneToMany,
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