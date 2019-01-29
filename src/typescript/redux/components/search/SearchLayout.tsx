import * as React from 'react';
import SearchGroup from './SearchGroup';
import SearchInputContainer from './SearchInputContainer';
import SearchResultsContainer from './SearchResultsContainer';
import PageLayout from '../layouts/PageLayout';
import GoBackHeader from '../layouts/GoBackHeader';
import { ExtractProps } from '../../../externals';

interface Props {
  onClickBack?: () => any;
  currentSearch?: string;
  onChangeSearch: React.FormEventHandler;
}

const SearchLayout: React.SFC<Props> = (props) => {
  return (
    <PageLayout
      key="search"
      header={
        <GoBackHeader
          input={
            <SearchInputContainer />
          }
        />
      }
      content={
        <div className="row mt-2 h-100">
          <div className="col mh-100 mb-2">
            <SearchResultsContainer />
          </div>
        </div>
      }
    />
  );
}

export default SearchLayout;
