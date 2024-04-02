import * as React from "react";
import SearchGroup from "./SearchGroup.js";
import SearchInputContainer from "./SearchInputContainer.js";
import SearchResultsContainer from "./SearchResultsContainer.js";
import PageLayout from "../layouts/PageLayout.js";
import GoBackHeader from "../layouts/GoBackHeader.js";
import AccordionContainer from "../layouts/AccordionContainer.js";
import SearchFilters from "./SearchFilters.js";

interface Props {
  onClickBack?: () => any;
  currentSearch?: string;
  onChangeSearch: React.FormEventHandler;
}

const SearchLayout: React.SFC<Props> = (props) => {
  return (
    <PageLayout
      key="search"
      header={<GoBackHeader input={<SearchInputContainer />} />}
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
                  content={() => <SearchFilters onSubmit={() => {}} />}
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
