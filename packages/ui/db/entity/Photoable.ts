import { cascadeOneToMany } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { Photo } from "@/db/entity/Photo";
import { IPhotoable } from "models";
import { EntitySchema } from "typeorm";

export type Photoable = IPhotoable & {
  photos: Photo[];
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
  },
});

export default PhotoableSchema;
