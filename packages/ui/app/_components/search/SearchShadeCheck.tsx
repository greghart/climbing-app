"use client";

import { searchParamsParsers } from "@/app/_components/search/searchParams";
import useQueryState from "@/app/_util/useQueryState";
import { Checkbox, FormControl, FormControlLabel } from "@mui/material";
import * as React from "react";

function SearchShadeCheck(props: React.ComponentProps<typeof FormControl>) {
  const [shade, setShade] = useQueryState("shade", searchParamsParsers.shade);
  return (
    <FormControlLabel
      control={<Checkbox />}
      label="Only show shady(ish) routes at:"
      checked={shade}
      onChange={(_, checked) => setShade(checked)}
    />
  );
}

export default SearchShadeCheck;
