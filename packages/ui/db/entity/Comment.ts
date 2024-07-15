import { cascadeManyToOne } from "@/db/cascadeOptions";
import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { CommentableSchema } from "@/db/entity/Commentable";
import { type IComment } from "models";
import { EntitySchema } from "typeorm";

export type CommentSchema = IComment & {
  commentable: CommentableSchema;
};

const Comment = new EntitySchema<CommentSchema>({
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

export default Comment;
