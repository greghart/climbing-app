import * as React from 'react';

import Area from '../../../models/Area';
import withCommentable from './withCommentable';
import ShowCommentable from '../comments/ShowCommentable';

interface OwnProps {
  area: Area,
}

const Container = withCommentable()(ShowCommentable);

const AreaCommentsContainer: React.SFC<OwnProps> = (props) => {
  return (
    <Container
      {...props}
      newRoute={`/areas/${props.area.id}/comments/new`}
      commentable={props.area.commentable}
    />
  );
}

export default AreaCommentsContainer;
