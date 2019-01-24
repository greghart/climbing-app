import * as React from "react";
import AnimationContext from "../animations/AnimationContext";
import SlideUp from "../animations/SlideUp";
import classNames = require("classnames");

/**
 * A layout for a normal (non-map) page
 *
 * Handles:
 *   * Fullscreen container
 *   * Background color (default)
 *   * Basic structure -- fixed header slot & content
 */

interface Props {
  header: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

const PageLayout: React.SFC<Props> = (props) => {
  return (
    <div className={classNames('container fullscreen', props.className)}>
      <div className="row no-gutters pt-3">
        <div className="col">
          {props.header}
        </div>
      </div>
      {props.content}
      {/* <AnimationContext.Consumer>
        {(animation) => {
          return (
            <SlideUp {...animation} appear={true}>
              {props.content}
            </SlideUp>
          );
        }}
      </AnimationContext.Consumer> */}
    </div>
  );
}

PageLayout.defaultProps = {
  className: 'bg-secondary'
};

export default PageLayout;
