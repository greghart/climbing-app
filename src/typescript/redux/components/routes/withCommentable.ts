import { compose } from 'redux';

import { fetchCommentableForRoute } from '../../ducks/operations/fetchCommentable';
import withMountDispatch from '../../decorators/withMountDispatch';
import withLoader from '../../decorators/withLoader';
import Route from '../../../models/Route';
import { InferableComponentEnhancerWithProps } from 'react-redux';

interface OwnProps {
  myRoute: Route
}

/**
 * Simple decorator to fetch a route's commentable on mount
 */
function withCommentable<InputProps extends OwnProps>() {
  return compose(
    withMountDispatch<InputProps>(
      (props) => fetchCommentableForRoute(props.myRoute),
      (props) => !props.myRoute.commentable
    ),
    withLoader<InputProps>(
      (props) => !props.myRoute.commentable
    )
  ) as InferableComponentEnhancerWithProps<{}, InputProps>;
};

export default withCommentable;
