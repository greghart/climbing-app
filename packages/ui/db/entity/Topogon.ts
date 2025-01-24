import { Area, Boulder, Route } from "@/db";
import { cascadeManyToOne } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { Topo } from "@/db/entity/Topo";
import { ITopogon } from "models";
import { EntitySchema } from "typeorm";

export type Topogon = Omit<ITopogon, "data"> & {
  topo: Topo;
  data: string; // Our implementation is just stringified JSON
  area?: Area;
  boulder?: Boulder;
  route?: Route;
};

const TopogonSchema = new EntitySchema<Topogon>({
  name: "topogon",
  columns: {
    ...BaseColumnSchemaPart,
    label: {
      type: String,
      nullable: true,
    },
    data: {
      type: String,
    },
  },
  relations: {
    topo: {
      type: "many-to-one",
      target: "topo",
      ...cascadeManyToOne,
      nullable: false,
    },
    area: {
      type: "many-to-one",
      target: "area",
      onDelete: "SET NULL",
    },
    boulder: {
      type: "many-to-one",
      target: "boulder",
      onDelete: "SET NULL",
    },
    route: {
      type: "many-to-one",
      target: "route",
      onDelete: "SET NULL",
    },
  },
});

export default TopogonSchema;
