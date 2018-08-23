import * as React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { ANIMATION_LENGTH_MS } from '.';

const SlideUp: React.SFC<any> = (props) => {
  return (
    <CSSTransitionGroup 
      transitionName="slide-up"
      transitionEnterTimeout={ANIMATION_LENGTH_MS}
      transitionLeaveTimeout={ANIMATION_LENGTH_MS}
      transitionAppearTimeout={ANIMATION_LENGTH_MS}
      transitionAppear={false}
    >
      {props.children}
    </CSSTransitionGroup>
  );
};

export default SlideUp;
