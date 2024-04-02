import { compose } from "redux";

import { fetchCommentableForArea } from "../../ducks/operations/fetchCommentable.js";
import withMountDispatch from "../../decorators/withMountDispatch.js";
import withLoader from "../../decorators/withLoader.js";
import Area from "../../../models/Area.js";
import { type InferableComponentEnhancerWithProps } from "react-redux";

interface OwnProps {
  area: Area;
}

/**
 * Simple decorator to fetch a area's commentable on mount
 */
function withCommentable<InputProps extends OwnProps>() {
  return compose(
    withMountDispatch<InputProps>(
      (props) => fetchCommentableForArea(props.area),
      (props) => !props.area.commentable
    ),
    withLoader<InputProps>((props) => !props.area.commentable)
  ) as InferableComponentEnhancerWithProps<{}, InputProps>;
}

export default withCommentable;
