import * as React from 'react';

import Route from '../../../models/Route';
import withCommentable from './withCommentable';
import ShowCommentable from '../comments/ShowCommentable';

interface OwnProps {
  myRoute: Route;
}

const Container = withCommentable(ShowCommentable);

const RouteCommentsContainer: React.SFC<OwnProps> = (props) => {
  return (
    <Container
      {...props}
      newRoute={`/routes/${props.myRoute.id}/comments/new`}
    />
  );
};

export default RouteCommentsContainer;
