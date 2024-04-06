import * as React from "react";

const SearchInput = (props: React.ComponentProps<"input">) => {
  return (
    <input
      type="text"
      className="form-control"
      placeholder="Search by area, boulder, or route"
      autoFocus
      {...props}
    />
  );
};

export default SearchInput;
