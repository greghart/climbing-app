import { compose } from 'redux';

import { fetchCommentableForCrag } from '../../ducks/operations/fetchCommentable';
import withMountDispatch from '../../decorators/withMountDispatch';
import withLoader from '../../decorators/withLoader';
import Crag from '../../../models/Crag';
import { InferableComponentEnhancerWithProps } from 'react-redux';

interface OwnProps {
  crag: Crag
}

/**
 * Simple decorator to fetch a area's commentable on mount
 */
function withCommentable<InputProps extends OwnProps>() {
  return compose(
    withMountDispatch<InputProps>(
      (props) => fetchCommentableForCrag(props.crag),
      (props) => !props.crag.commentable
    ),
    withLoader<InputProps>(
      (props) => !props.crag.commentable
    )
  ) as InferableComponentEnhancerWithProps<{}, InputProps>;
};

export default withCommentable;
