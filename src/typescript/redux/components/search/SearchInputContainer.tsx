import type { ChangeEvent } from "react";
import { connect } from "react-redux";

import SearchInput from "./SearchInput.js";
import { search } from "../../ducks/search.js";
import type { State } from "../../reducer.js";

/**
 * Container around search input.
 *
 * Currently singleton state
 */
const mapStateToProps = (state: State) => {
  return {
    value: state.search.search,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      return dispatch(search(e.target.value));
    },
  };
};

export default connect<
  ReturnType<typeof mapStateToProps>,
  ReturnType<typeof mapDispatchToProps>,
  any
>(
  mapStateToProps,
  mapDispatchToProps
)(SearchInput);
