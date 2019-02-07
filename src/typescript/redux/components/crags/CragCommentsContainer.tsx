import * as React from 'react';

import Crag from '../../../models/Crag';
import withCommentable from './withCommentable';
import ShowCommentable from '../comments/ShowCommentable';

interface OwnProps {
  crag: Crag,
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
}

export default CragCommentsContainer;

