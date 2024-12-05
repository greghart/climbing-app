import { cascadeManyToOne } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { Photoable } from "@/db/entity/Photoable";
import { type IPhoto } from "models";
import { EntitySchema } from "typeorm";

export type Photo = IPhoto & {
  photoable: Photoable;
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
      type: "one-to-one",
      target: "upload",
      joinColumn: true,
      onDelete: "CASCADE",
      cascade: ["insert", "update", "remove"],
    },
  },
});

export default PhotoSchema;
