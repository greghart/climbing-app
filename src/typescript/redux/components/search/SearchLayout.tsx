import * as React from 'react';
import SearchGroup from './SearchGroup';
import SearchInputContainer from './SearchInputContainer';
import SearchResultsContainer from './SearchResultsContainer';
import PageLayout from '../layouts/PageLayout';
import GoBackHeader from '../layouts/GoBackHeader';
import { ExtractProps } from '../../../externals';
import AccordionContainer from '../layouts/AccordionContainer';
import SearchFilters from './SearchFilters';

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
            <div className="card mb-2">
              <div className="card-body p-1">
                <AccordionContainer
                  scope="search-filters"
                  header={(defaultChevron) => (
                    <span>Open Search Filters {defaultChevron}</span>
                  )}
                  defaultOpen={false}
                  content={() => (
                    <SearchFilters
                      onSubmit={() => {}}
                    />
                  )}
                />
              </div>
            </div>
            <SearchResultsContainer />
          </div>
        </div>
      }
    />
  );
};

export default SearchLayout;
