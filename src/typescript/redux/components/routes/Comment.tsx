import * as React from "react";
import type { Omit } from "utility-types";

import ProfileIcon from "../users/ProfileIcon";
import Timestamp from "../Timestamp";
import CommentModel from "../../../models/Comment";
import User from "../../../models/User";
import normalizeRenderer, { type Renderable } from "../util/normalizeRenderer";

type Base = Omit<CommentModel, "commentable">;

interface Props {
  comment: Base;
  body?: Renderable<Base>;
  user: User;
}

const Comment: React.SFC<Props> = (props) => {
  return (
    <li className="list-group-item">
      <div className="row">
        <div className="col-auto">
          <ProfileIcon user={props.user} />
        </div>
        <div className="col">
          {normalizeRenderer(props.body)(props.comment)}
        </div>
      </div>
    </li>
  );
};

Comment.defaultProps = {
  body: (comment: Base) => (
    <div>
      <p>{comment.text}</p>
      <small>
        Posted <Timestamp timestamp={comment.timestamps.createdAt} />
      </small>
    </div>
  ),
};

export default Comment;
