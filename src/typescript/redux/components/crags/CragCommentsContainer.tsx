import * as React from "react";

import Crag from "../../../models/Crag.js";
import withCommentable from "./withCommentable.js";
import ShowCommentable from "../comments/ShowCommentable.js";

interface OwnProps {
  crag: Crag;
}

const Container = withCommentable()(ShowCommentable);

const CragCommentsContainer: React.SFC<OwnProps> = (props) => {
  return (
    <Container
      {...props}
      newRoute={`/crags/${props.crag.id}/comments/new`}
      commentable={props.crag.commentable}
    />
  );
};

export default CragCommentsContainer;
