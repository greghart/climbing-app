import { Area, Boulder, Route } from "@/db";
import { cascadeManyToOne } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { Topo } from "@/db/entity/Topo";
import { ITopogon } from "models";
import { EntitySchema } from "typeorm";

// Implementation of foreign keys
export interface TopogonEntityKeys {
  routeId: number | null;
  boulderId: number | null;
  areaId: number | null;
}

export type Topogon = ITopogon &
  TopogonEntityKeys & {
    topo: Topo;
    // Our implementation is just stringified JSON, but we also want this
    // to be transparent
    // data: string;
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
    areaId: {
      type: "int",
      nullable: true,
    },
    boulderId: {
      type: "int",
      nullable: true,
    },
    routeId: {
      type: "int",
      nullable: true,
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
