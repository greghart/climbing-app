import * as React from 'react';
import SearchGroup from './SearchGroup';
import SearchInput from './SearchInput';
import SlideUp from '../animations/SlideUp';
import AnimationContext from '../animations/AnimationContext';

interface Props {
  onClickBack?: () => any;
}

const SearchLayout: React.SFC<Props> = (props) => {
  return (
    <div className="container fullscreen bg-secondary">
      <div
        className="over-map fixed-container row no-gutters"
      >
        <div className="col">
          <SearchGroup
            onClickPrepend={props.onClickBack}
            prepend={
              <i className="fa fa-arrow-left" />
            }
            input={
              <SearchInput />
            }
          />
        </div>
      </div>
      <AnimationContext.Consumer>
        {animation => (
          <SlideUp {...animation}>
            <div className="row below-fixed">
              <div className="col">
                Hello thar!
              </div>
            </div>
          </SlideUp>
        )}
      </AnimationContext.Consumer>
    </div>
  )
}

export default SearchLayout;
