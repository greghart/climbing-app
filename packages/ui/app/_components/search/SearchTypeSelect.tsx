"use client";

import { searchParamsParsers } from "@/app/_components/search/searchParams";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { debounce } from "lodash-es";
import { useQueryState } from "nuqs";
import * as React from "react";

const SearchInput = (props: React.ComponentProps<typeof FormControl>) => {
  const [type, setType] = useQueryState("type", searchParamsParsers.type);
  const debouncedSetType = React.useCallback(debounce(setType, 350), [setType]);
  return (
    <FormControl fullWidth {...props}>
      <InputLabel id="demo-simple-select-label">What kind?</InputLabel>
      <Select
        labelId="entity-type-select-label"
        id="entity-type-select"
        label="Looking for a specific type?"
        value={type}
        onChange={(e) => debouncedSetType(e.target.value)}
      >
        <MenuItem value="any">Any</MenuItem>
        <MenuItem value="route">Routes</MenuItem>
        <MenuItem value="boulder">Boulders</MenuItem>
        <MenuItem value="area">Areas</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SearchInput;
