"use client";

import { searchParamsParsers } from "@/app/_components/search/searchParams";
import { debounce } from "lodash-es";
import { useQueryState } from "nuqs";
import * as React from "react";

const SearchInput = (props: React.ComponentProps<"input">) => {
  const [search, setSearch] = useQueryState(
    "search",
    searchParamsParsers.search
  );
  const debouncedSearch = React.useCallback(debounce(setSearch, 350), [
    setSearch,
  ]);
  return (
    <input
      type="text"
      className="form-control"
      placeholder="Search by area, boulder, or route"
      autoFocus
      {...props}
      onChange={(e) => {
        debouncedSearch(e.target.value);
      }}
      defaultValue={search}
    />
  );
};

export default SearchInput;
