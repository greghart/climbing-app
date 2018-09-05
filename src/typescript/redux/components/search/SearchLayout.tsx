import * as React from 'react';
import SearchGroup from './SearchGroup';
import SearchInputContainer from './SearchInputContainer';
import SearchResultsContainer from './SearchResultsContainer';
import PageLayout from '../layouts/PageLayout';
import GoBackHeader from '../layouts/GoBackHeader';

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
        <SearchResultsContainer />
      }
    />
  );
}

export default SearchLayout;
