import * as React from 'react';
import Route from '../../../models/Route';
import NewCommentContainer from '../comments/NewCommentContainer';
import withCommentable from './withCommentable';

interface OwnProps {
  myRoute: Route;
}
const Container = withCommentable()(NewCommentContainer);

const RouteNewCommentContainer: React.SFC<OwnProps> = (props) => {
  return (
    <Container
      {...props}
      commentable={props.myRoute.commentable}
      redirect={`/routes/${props.myRoute.id}/comments`}
      // TODO user-feature
      user={{
        id: 1,
        name: 'Greg Hart',
        email: 'greghartemail@gmail.com',
        comments: [],
      }}
    />
  );
};

export default RouteNewCommentContainer;
