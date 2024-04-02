import { compose } from "redux";

import { fetchCommentableForCrag } from "../../ducks/operations/fetchCommentable.js";
import withMountDispatch from "../../decorators/withMountDispatch.js";
import withLoader from "../../decorators/withLoader.js";
import Crag from "../../../models/Crag.js";
import type { InferableComponentEnhancerWithProps } from "react-redux";

interface OwnProps {
  crag: Crag;
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
    withLoader<InputProps>((props) => !props.crag.commentable)
  ) as InferableComponentEnhancerWithProps<{}, InputProps>;
}

export default withCommentable;
