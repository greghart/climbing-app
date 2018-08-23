import * as React from 'react';
import ReactCSSTransitionGroup = require('react-addons-css-transition-group');

const SlideUp: React.SFC<any> = (props) => {
  return (
    <ReactCSSTransitionGroup 
      transitionName="slide-up"
      transitionEnter={false}
      transitionLeaveTimeout={10000}
      transitionAppear={true}
      transitionAppearTimeout={10000}
    >
      <div className="slide-target" key={props.key}>
        {props.children}
      </div>
    </ReactCSSTransitionGroup>
  );
};

export default SlideUp;
