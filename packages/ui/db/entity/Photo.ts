import { Upload } from "@/db";
import { cascadeManyToOne } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { Photoable } from "@/db/entity/Photoable";
import { type IPhoto } from "models";
import { EntitySchema } from "typeorm";

export type Photo = IPhoto & {
  photoable: Photoable;
  upload: Upload;
};

const PhotoSchema = new EntitySchema<Photo>({
  name: "photo",
  columns: {
    ...BaseColumnSchemaPart,
    title: {
      type: String,
    },
    description: {
      type: String,
      nullable: true,
    },
  },
  relations: {
    photoable: {
      type: "many-to-one",
      target: "photoable",
      ...cascadeManyToOne,
    },
    upload: {
      type: "many-to-one",
      target: "upload",
      ...cascadeManyToOne,
    },
    topo: {
      type: "one-to-one",
      target: "topo",
    },
  },
});

export default PhotoSchema;
