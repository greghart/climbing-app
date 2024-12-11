"use client";

import SearchField from "@/app/_components/search/SearchField";
import { searchParamsParsers } from "@/app/_components/search/searchParams";
import useQueryState from "@/app/_util/useQueryState";
import * as React from "react";

const ConnectedSearch = (props: React.ComponentProps<typeof SearchField>) => {
  const [search, setSearch] = useQueryState(
    "search",
    searchParamsParsers.search
  );
  return (
    <SearchField
      placeholder="Search by area, boulder, or route"
      autoFocus
      {...props}
      onChange={(e) => {
        setSearch(e.target.value);
      }}
      defaultValue={props.value ? undefined : search}
    />
  );
};

export default ConnectedSearch;
