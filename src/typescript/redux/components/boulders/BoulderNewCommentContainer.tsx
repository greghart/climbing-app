import * as React from "react";

import Boulder from "../../../models/Boulder.js";
import NewCommentContainer from "../comments/NewCommentContainer.js";
import withCommentable from "./withCommentable.js";

interface OwnProps {
  boulder: Boulder;
}
const Container = withCommentable()(NewCommentContainer);

const BoulderNewCommentContainer: React.SFC<OwnProps> = (props) => {
  return (
    <Container
      {...props}
      commentable={props.boulder.commentable}
      redirect={`/boulders/${props.boulder.id}/comments`}
      // TODO user-feature
      user={{
        id: 1,
        name: "Greg Hart",
        email: "greghartemail@gmail.com",
        comments: [],
      }}
    />
  );
};

export default BoulderNewCommentContainer;
