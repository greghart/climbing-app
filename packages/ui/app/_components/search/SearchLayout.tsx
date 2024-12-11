import GoBackHeader from "@/app/_components/layouts/GoBackHeader";
import PageLayout from "@/app/_components/layouts/PageLayout";
import ConnectedSearch from "@/app/_components/search/ConnectedSearch";
import SearchFilters from "@/app/_components/search/SearchFilters";
import SearchResults from "@/app/_components/search/SearchResults";
import { SearchResult } from "@/app/api/_actions/search";
import { Stack } from "@mui/material";
import { Crag, ICrag } from "models";
import * as React from "react";
// import SearchResultsContainer from "./SearchResultsContainer.js";
// import AccordionContainer from "../layouts/AccordionContainer.js";
// import SearchFilters from "./SearchFilters.js";

interface Props {
  crag: ICrag;
  results?: Array<SearchResult>;
  onClickBack?: () => any;
  currentSearch?: string;
  onChangeSearch?: React.FormEventHandler;
}

function SearchLayout(props: Props) {
  const crag = new Crag(props.crag);
  return (
    <PageLayout
      key="search"
      header={
        <Stack spacing={1}>
          <GoBackHeader Component={ConnectedSearch} href={`./explorer`} />
          <SearchFilters shadeLocation={crag.center.literal} />
        </Stack>
      }
      content={<SearchResults results={props.results} />}
    />
  );
}

export default SearchLayout;
