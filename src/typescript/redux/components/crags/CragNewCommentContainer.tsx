import * as React from 'react';

import Crag from '../../../models/Crag';
import NewCommentContainer from '../comments/NewCommentContainer';
import withCommentable from './withCommentable';

interface OwnProps {
  crag: Crag;
}
const Container = withCommentable()(NewCommentContainer);

const CragNewCommentContainer: React.SFC<OwnProps> = (props) => {
  return (
    <Container
      {...props}
      commentable={props.crag.commentable}
      redirect={`/crags/${props.crag.id}/comments`}
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

export default CragNewCommentContainer;
