import * as React from "react";
import { CSSTransition } from "react-transition-group";
import { ANIMATION_LENGTH_MS } from ".";
import type { TransitionProps } from "react-transition-group/Transition";

/**
 * An empty animation
 *
 * Useful if you need to animate a sub-component, so need to live some parent alive for
 * the duration.
 */
const Empty: React.SFC<Partial<TransitionProps>> = (props) => {
  return (
    <CSSTransition
      {...props}
      classNames="empty"
      timeout={ANIMATION_LENGTH_MS}
    />
  );
};
Empty.defaultProps = {
  in: false,
};

export default Empty;
