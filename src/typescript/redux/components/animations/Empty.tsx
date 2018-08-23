/**
 * An empty animation
 * 
 * Useful if you need to animate a sub-component, so need to live some parent alive for
 * the duration.
 */
import * as React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { ANIMATION_LENGTH_MS } from '.';

const Empty: React.SFC<any> = (props) => {
  return (
    <CSSTransitionGroup 
      transitionName="empty"
      transitionEnterTimeout={ANIMATION_LENGTH_MS}
      transitionLeaveTimeout={ANIMATION_LENGTH_MS}
      transitionAppearTimeout={ANIMATION_LENGTH_MS}
      transitionAppear={true}
    >
      {props.children}
    </CSSTransitionGroup>
  );
};

export default Empty;
