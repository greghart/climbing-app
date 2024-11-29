import { cascadeOneToMany } from "@/db/cascadeOptions";
import { AreaSchema } from "@/db/entity/Area";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import Bounds, { BoundsSchema } from "@/db/entity/Bounds";
import { CommentableSchema } from "@/db/entity/Commentable";
import { type ICrag } from "models";
import { EntitySchema } from "typeorm";
import Coordinate, { CoordinateSchema } from "./Coordinate";

export type CragSchema = Omit<ICrag, "bounds"> & {
  areas?: AreaSchema[];
  center: CoordinateSchema;
  bounds?: BoundsSchema;
  commentable?: CommentableSchema;
};

const Crag = new EntitySchema<CragSchema>({
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
      schema: Coordinate,
      prefix: "center_",
    },
    bounds: {
      schema: Bounds,
      prefix: "bounds_",
    },
  },
});

export default Crag;
