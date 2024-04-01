import * as React from "react";
import { CSSTransition } from "react-transition-group";
import { ANIMATION_LENGTH_MS } from ".";
import type { TransitionProps } from "react-transition-group/Transition";

/**
 * Sliding upward animation.
 *
 * On enter it slides up, on exit it just keeps on sliding up!
 */
const SlideUp: React.SFC<Partial<TransitionProps>> = (props) => {
  console.warn(
    {
      props,
    },
    "SlideUp"
  );
  return (
    <CSSTransition
      {...props}
      classNames="slide-up"
      timeout={ANIMATION_LENGTH_MS}
    >
      {(state) => props.children}
    </CSSTransition>
  );
};

export default SlideUp;
