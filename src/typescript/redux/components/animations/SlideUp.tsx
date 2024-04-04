import * as React from "react";
import ReactTransitionGroup from "react-transition-group";
import { ANIMATION_LENGTH_MS } from "./index.js";

/**
 * Sliding upward animation.
 *
 * On enter it slides up, on exit it just keeps on sliding up!
 */
const SlideUp: React.SFC<
  Partial<ReactTransitionGroup.CSSTransition.CSSTransitionProps>
> = (props) => {
  console.warn(
    {
      props,
    },
    "SlideUp"
  );
  return (
    <ReactTransitionGroup.CSSTransition
      {...props}
      classNames="slide-up"
      timeout={ANIMATION_LENGTH_MS}
    >
      {(state) => props.children}
    </ReactTransitionGroup.CSSTransition>
  );
};

export default SlideUp;
