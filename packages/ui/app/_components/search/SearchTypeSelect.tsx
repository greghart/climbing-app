"use client";

import { searchParamsParsers } from "@/app/_components/search/searchParams";
import useQueryState from "@/app/_components/useQueryState";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import * as React from "react";

function SearchTypeSelect(props: React.ComponentProps<typeof FormControl>) {
  const [type, setType] = useQueryState("type", searchParamsParsers.type);
  return (
    <FormControl fullWidth {...props}>
      <InputLabel id="demo-simple-select-label">What kind?</InputLabel>
      <Select
        labelId="entity-type-select-label"
        id="entity-type-select"
        label="Looking for a specific type?"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <MenuItem value="any">Any</MenuItem>
        <MenuItem value="route">Routes</MenuItem>
        <MenuItem value="boulder">Boulders</MenuItem>
        <MenuItem value="area">Areas</MenuItem>
      </Select>
    </FormControl>
  );
}

export default SearchTypeSelect;
