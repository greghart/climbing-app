import { ChangeEvent } from 'react';
import { connect } from 'react-redux';

import SearchInput from './SearchInput';
import { search } from '../../ducks/search';
import { State } from '../../reducer';

/**
 * Container around search input.
 * 
 * Currently singleton state
 */
const mapStateToProps = (state: State) => {
  return {
    value: state.search.search
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      return dispatch(
        search(e.target.value),
      );
    } 
  };
};

export default connect<ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps>, any>(
  mapStateToProps,
  mapDispatchToProps
)(SearchInput);
