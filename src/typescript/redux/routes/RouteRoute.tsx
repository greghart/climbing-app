import * as React from 'react';
import SFC = React.SFC;
import { RouteConfigComponentProps } from "react-router-config";

import SearchContainer from '../components/search/SearchContainer';

interface SearchParams {
}
const SearchRoute: SFC<RouteConfigComponentProps<SearchParams>> = (props) => {
  return (
    <SearchContainer />
  );
};

export default SearchRoute;


