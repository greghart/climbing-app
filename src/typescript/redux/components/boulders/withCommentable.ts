import { compose } from 'redux';

import { fetchCommentableForBoulder } from '../../ducks/operations/fetchCommentable';
import withMountDispatch from '../../decorators/withMountDispatch';
import withLoader from '../../decorators/withLoader';
import Boulder from '../../../models/Boulder';
import { InferableComponentEnhancerWithProps } from 'react-redux';

interface OwnProps {
  boulder: Boulder
}

/**
 * Simple decorator to fetch a boulder's commentable on mount
 */
function withCommentable<InputProps extends OwnProps>() {
  return compose(
    withMountDispatch<InputProps>(
      (props) => fetchCommentableForBoulder(props.boulder),
      (props) => !props.boulder.commentable
    ),
    withLoader<InputProps>(
      (props) => !props.boulder.commentable
    )
  ) as InferableComponentEnhancerWithProps<{}, InputProps>;
};

export default withCommentable;

