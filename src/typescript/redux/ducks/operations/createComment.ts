import { normalize } from "normalizr";
import omit from "lodash/omit";
import * as t from "io-ts";

import { receiveEntities } from "../entities";
import { CommentableSchema } from "../../normalizr";
import validate from "./util/validate";
import getSwagger from "./util/getSwagger";
import Commentable from "../../../models/Commentable";

/**
 * Run-time boundary validation:
 * 1. Happens from form input, where we don't know if the user input valid data
 * 2. Happens from API response, where we don't know what server responded with.
 * 3. Happens on server from client request, where we don't know what client sent.
 *
 * #2 and #3 should be handled by swagger layer.
 * #1 we will handle with `io-ts`
 **/

const FormData = t.type({
  text: t.refinement(t.string, (text) => text.length > 2, "text.minLength"),
});

export default (commentable: Commentable, text: string) => {
  return (dispatch) => {
    return validate({ text }, FormData)
      .then((commentData) => {
        console.warn("DEBUG DATA", commentData, "VS", text);
        return getSwagger().commentables.addComment(
          commentable.id.toString(),
          commentData
        );
      })
      .then((comment) => {
        // Receive the new comment, and add to commentable
        return dispatch(
          receiveEntities(
            normalize(
              {
                ...commentable,
                comments: [
                  omit(comment, "commentable"),
                  ...commentable.comments,
                ],
              },
              CommentableSchema
            )
          )
        );
      });
  };
};
