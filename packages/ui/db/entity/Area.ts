import { Boulder, Commentable, Crag, Photoable, Polygon } from "@/db";
import { cascadeManyToOne, cascadeOneToMany } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { type IArea } from "models";
import { EntitySchema } from "typeorm";

export type Area = IArea & {
  polygon?: Polygon;
  crag?: Crag;
  boulders?: Boulder[];
  commentable?: Commentable;
  photoable?: Photoable;
};

const AreaSchema = new EntitySchema<Area>({
  name: "area",
  columns: {
    ...BaseColumnSchemaPart,
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
    commentable: {
      type: "one-to-one",
      nullable: true,
      target: "commentable",
      onDelete: "SET NULL",
      joinColumn: true,
    },
    photoable: {
      type: "one-to-one",
      nullable: true,
      target: "photoable",
      onDelete: "SET NULL",
      joinColumn: true,
    },
  },
});

export default AreaSchema;
