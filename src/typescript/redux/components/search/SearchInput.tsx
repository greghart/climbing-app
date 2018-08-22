import * as React from 'react';

const SearchInput = (props) => {
  return (
    <input 
      type="text" 
      className="form-control" 
      placeholder="Search by crag, boulder, or route"
      autoFocus
      {...props}
    />
  );
};

export default SearchInput;
