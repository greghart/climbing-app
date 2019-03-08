import * as React from 'react';

const SearchInput = (props) => {
  return (
    <input
      type="text"
      className="form-control"
      placeholder="Search by area, boulder, or route"
      autoFocus
      onChange={props.onChange}
      {...props}
    />
  );
};

export default SearchInput;
