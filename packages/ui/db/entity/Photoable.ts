import { Area, Boulder, Photo, Route } from "@/db";
import { cascadeOneToMany } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { Crag } from "@/db/entity/Crag";
import { IPhotoable } from "models";
import { EntitySchema } from "typeorm";

export type Photoable = IPhotoable & {
  photos: Photo[];
  crag?: Crag;
  area?: Area;
  boulder?: Boulder;
  route?: Route;
};

const PhotoableSchema = new EntitySchema<Photoable>({
  name: "photoable",
  columns: {
    ...BaseColumnSchemaPart,
    descriptor: {
      type: String,
    },
  },
  relations: {
    photos: {
      type: "one-to-many",
      target: "photo",
      inverseSide: "photoable",
      ...cascadeOneToMany,
    },
    crag: {
      type: "one-to-one",
      target: "crag",
      inverseSide: "photoable",
    },
    area: {
      type: "one-to-one",
      target: "area",
      inverseSide: "photoable",
    },
    boulder: {
      type: "one-to-one",
      target: "boulder",
      inverseSide: "photoable",
    },
    route: {
      type: "one-to-one",
      target: "route",
      inverseSide: "photoable",
    },
  },
});

export default PhotoableSchema;
