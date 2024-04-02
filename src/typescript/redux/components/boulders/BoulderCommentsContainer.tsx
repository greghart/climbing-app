import * as React from "react";

import Boulder from "../../../models/Boulder.js";
import withCommentable from "./withCommentable.js";
import ShowCommentable from "../comments/ShowCommentable.js";

interface OwnProps {
  boulder: Boulder;
}

const Container = withCommentable()(ShowCommentable);

const BoulderCommentsContainer: React.SFC<OwnProps> = (props) => {
  return (
    <Container
      {...props}
      newRoute={`/boulders/${props.boulder.id}/comments/new`}
      commentable={props.boulder.commentable}
    />
  );
};

export default BoulderCommentsContainer;
