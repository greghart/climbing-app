import * as React from "react";

import Area from "../../../models/Area.js";
import NewCommentContainer from "../comments/NewCommentContainer.js";
import withCommentable from "./withCommentable.js";

interface OwnProps {
  area: Area;
}
const Container = withCommentable()(NewCommentContainer);

const AreaNewCommentContainer: React.SFC<OwnProps> = (props) => {
  return (
    <Container
      {...props}
      commentable={props.area.commentable}
      redirect={`/areas/${props.area.id}/comments`}
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

export default AreaNewCommentContainer;
