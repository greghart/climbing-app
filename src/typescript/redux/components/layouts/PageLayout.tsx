import * as React from "react";
import AnimationContext from "../animations/AnimationContext";
import SlideUp from "../animations/SlideUp";

/**
 * A layout for a normal (non-map) page
 *
 * Handles:
 *   * Fullscreen
 *   * Background color
 *   * Basic structure -- fixed header slot & content
 */

interface Props {
  header: React.ReactNode;
  content: React.ReactNode;
}

const PageLayout: React.SFC<Props> = (props) => {
  return (
    <div className="container fullscreen bg-secondary">
      <div
        className="row no-gutters pt-3"
      >
        <div className="col">
          {props.header}
        </div>
      </div>
      <AnimationContext.Consumer>
        {(animation) => {
          console.warn({
            animation
          }, 'PageLayout');
          return (
            <SlideUp {...animation} appear={true}>
              <div className="row mt-2 h-100">
                <div className="col mh-100 mb-2">
                  {props.content}
                </div>
              </div>
            </SlideUp>
          );
        }}
      </AnimationContext.Consumer>
    </div>
  );
}

export default PageLayout;
