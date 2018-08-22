import * as React from 'react';
import SFC = React.SFC;
import { RouteConfigComponentProps, renderRoutes } from "react-router-config";

import SearchContainer from '../components/search/SearchContainer';

interface SearchParams {
}
const SearchRoute: SFC<RouteConfigComponentProps<SearchParams>> = (props) => {
  return (
    <SearchContainer key="search-key" />
  );
};

export default SearchRoute;

