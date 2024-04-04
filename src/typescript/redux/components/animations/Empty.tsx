import * as React from "react";
// TODO: Fucking christ https://github.com/microsoft/TypeScript/issues/54018
import ReactTransitionGroup from "react-transition-group";
import { ANIMATION_LENGTH_MS } from "./index.js";

/**
 * An empty animation
 *
 * Useful if you need to animate a sub-component, so need to live some parent alive for
 * the duration.
 */
const Empty: React.SFC<
  Partial<ReactTransitionGroup.CSSTransition.CSSTransitionProps>
> = (props) => {
  return (
    <ReactTransitionGroup.CSSTransition
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
