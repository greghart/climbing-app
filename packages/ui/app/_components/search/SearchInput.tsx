"use client";

import useRouteTo from "@/app/_components/useRouteTo";
import { debounce } from "lodash-es";
import { useSearchParams } from "next/navigation";
import * as React from "react";

const SearchInput = (props: React.ComponentProps<"input">) => {
  const searchParams = useSearchParams();
  const routeTo = useRouteTo({ includeSearchParams: true, replace: true });

  // Debounce search
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    routeTo("", params);
  }
  const debouncedSearch = React.useCallback(debounce(handleSearch, 350), [
    searchParams,
    routeTo,
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
      defaultValue={searchParams.get("query")?.toString()}
    />
  );
};

export default SearchInput;
