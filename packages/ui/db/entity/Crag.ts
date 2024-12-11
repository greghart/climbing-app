import { cascadeOneToMany } from "@/db/cascadeOptions";
import { Area } from "@/db/entity/Area";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import BoundsSchema, { Bounds } from "@/db/entity/Bounds";
import { Commentable } from "@/db/entity/Commentable";
import { Photoable } from "@/db/entity/Photoable";
import { type ICrag } from "models";
import { EntitySchema } from "typeorm";
import CoordinateSchema, { Coordinate } from "./Coordinate";

export type Crag = Omit<ICrag, "bounds"> & {
  areas?: Area[];
  center: Coordinate;
  bounds?: Bounds;
  commentable?: Commentable;
  photoable?: Photoable;
};

const CragSchema = new EntitySchema<Crag>({
  name: "crag",
  columns: {
    ...BaseColumnSchemaPart,
    name: {
      type: String,
    },
    description: {
      type: String,
      nullable: true,
    },
    defaultZoom: {
      type: "int",
    },
    minZoom: {
      type: "int",
      nullable: true,
    },
    maxZoom: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    areas: {
      type: "one-to-many",
      inverseSide: "crag",
      target: "area",
      ...cascadeOneToMany,
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
    trail: {
      type: "one-to-one",
      target: "trail",
      joinColumn: true,
      onDelete: "SET NULL",
      cascade: ["insert", "update"],
    },
  },
  embeddeds: {
    center: {
      schema: CoordinateSchema,
      prefix: "center_",
    },
    bounds: {
      schema: BoundsSchema,
      prefix: "bounds_",
    },
  },
});

export default CragSchema;
