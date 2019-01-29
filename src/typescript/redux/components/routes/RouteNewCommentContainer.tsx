import * as React from 'react';
import Route from '../../../models/Route';
import NewCommentsContainer from '../comments/NewCommentsContainer';
import withCommentable from './withCommentable';

interface OwnProps {
  myRoute: Route,
}
const Container = withCommentable()(NewCommentsContainer);

const RouteNewCommentContainer: React.SFC<OwnProps> = (props) => {
  return (
    <Container
      {...props}
      commentable={props.myRoute.commentable}
      redirect={`/routes/${props.myRoute.id}/comments`}
      // TODO user-feature
      user={{
        id: 1,
        name: "Greg Hart",
        email: 'greghartemail@gmail.com',
        comments: []
      }}
    />
  );
}

export default RouteNewCommentContainer;

