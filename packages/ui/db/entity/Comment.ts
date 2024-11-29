import { cascadeManyToOne } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { Commentable } from "@/db/entity/Commentable";
import { type IComment } from "models";
import { EntitySchema } from "typeorm";

export type Comment = IComment & {
  commentable: Commentable;
};

const CommentSchema = new EntitySchema<Comment>({
  name: "comment",
  columns: {
    ...BaseColumnSchemaPart,
    text: {
      type: String,
    },
  },
  relations: {
    commentable: {
      type: "many-to-one",
      target: "commentable",
      ...cascadeManyToOne,
    },
  },
});

export default CommentSchema;
