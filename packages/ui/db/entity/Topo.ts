import { cascadeOneToMany } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { Photo } from "@/db/entity/Photo";
import { Topogon } from "@/db/entity/Topogon";
import { ITopo } from "models";
import { EntitySchema } from "typeorm";

export type Topo = Omit<ITopo, "photo" | "topogons"> & {
  photo: Photo;
  topogons?: Topogon[];
};

const TopoSchema = new EntitySchema<Topo>({
  name: "topo",
  columns: {
    ...BaseColumnSchemaPart,
    title: {
      type: String,
    },
    scale: {
      type: "decimal",
    },
  },
  relations: {
    topogons: {
      type: "one-to-many",
      inverseSide: "topo",
      target: "topogon",
      ...cascadeOneToMany,
    },
    photo: {
      type: "one-to-one",
      target: "photo",
      onDelete: "CASCADE",
      joinColumn: true,
    },
  },
});

export default TopoSchema;
