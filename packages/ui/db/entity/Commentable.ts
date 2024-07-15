import { cascadeOneToMany } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { CommentSchema } from "@/db/entity/Comment";
import { ICommentable } from "models";
import { EntitySchema } from "typeorm";

export type CommentableSchema = ICommentable & {
  comments: CommentSchema[];
};

const Commentable = new EntitySchema<CommentableSchema>({
  name: "commentable",
  columns: {
    ...BaseColumnSchemaPart,
    descriptor: {
      type: String,
    },
  },
  relations: {
    comments: {
      type: "one-to-many",
      target: "comment",
      inverseSide: "commentable",
      ...cascadeOneToMany,
    },
  },
});

export default Commentable;
