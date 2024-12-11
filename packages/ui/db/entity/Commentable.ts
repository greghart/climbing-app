import { cascadeOneToMany } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { Comment } from "@/db/entity/Comment";
import { ICommentable } from "models";
import { EntitySchema } from "typeorm";

export type Commentable = ICommentable & {
  comments: Comment[];
};

const CommentableSchema = new EntitySchema<Commentable>({
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

export default CommentableSchema;
