"use client";

import { searchParamsParsers } from "@/app/_components/search/searchParams";
import useQueryState from "@/app/_components/useQueryState";
import * as React from "react";

const SearchInput = (props: React.ComponentProps<"input">) => {
  const [search, setSearch] = useQueryState(
    "search",
    searchParamsParsers.search
  );
  return (
    <input
      type="text"
      className="form-control"
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

export default SearchInput;
