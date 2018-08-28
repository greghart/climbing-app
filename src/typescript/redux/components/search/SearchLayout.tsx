import * as React from 'react';
import SearchGroup from './SearchGroup';
import SlideUp from '../animations/SlideUp';
import AnimationContext from '../animations/AnimationContext';
import SearchInputContainer from './SearchInputContainer';

interface Props {
  onClickBack?: () => any;
  currentSearch?: string;
  onChangeSearch: React.FormEventHandler;
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
              <SearchInputContainer />
            }
          />
        </div>
      </div>
      <AnimationContext.Consumer>
        {animation => (
          <SlideUp {...animation} className="below-fixed">
            <div className="row"> 
              <div className="col">
              </div>
            </div>
          </SlideUp>
        )}
      </AnimationContext.Consumer>
    </div>
  )
}

export default SearchLayout;
