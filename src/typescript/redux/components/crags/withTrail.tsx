import { compose } from "redux";

import fetchTrail from "../../ducks/operations/fetchTrail.js";
import withMountDispatch from "../../decorators/withMountDispatch.js";
import withLoader from "../../decorators/withLoader.js";
import Crag from "../../../models/Crag.js";
import type { InferableComponentEnhancerWithProps } from "react-redux";

interface OwnProps {
  crag: Crag;
}

/**
 * Simple decorator to fetch a crag's trail on mount
 */
function withTrail<InputProps extends OwnProps>() {
  return compose(
    withMountDispatch<InputProps>(
      (props) => fetchTrail(props.crag.id),
      (props) => props.crag.trail === undefined
    ),
    withLoader<InputProps>((props) => props.crag.trail === undefined)
  ) as InferableComponentEnhancerWithProps<{}, InputProps>;
}

export default withTrail;
