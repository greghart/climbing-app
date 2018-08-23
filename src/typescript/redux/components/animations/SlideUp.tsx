import * as React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

const SlideUp: React.SFC<any> = (props) => {
  return (
    <CSSTransitionGroup 
      transitionName="slide-up"
      transitionEnter={false}
      transitionLeaveTimeout={10000}
      transitionAppear={true}
      transitionAppearTimeout={10000}
    >
      <div className="slide-target" key={props.key}>
        {props.children}
      </div>
    </CSSTransitionGroup>
  );
};

export default SlideUp;
