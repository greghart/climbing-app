import { goBack } from 'connected-react-router';
import { connect } from 'react-redux';

import SearchLayout from './SearchLayout';

/**
 * Container around search layout 
 */
const mapDispatchToProps = (dispatch) => {
  return {
    onClickBack: () => {
      return dispatch(goBack());
    }
  };
};

export default connect<void, ReturnType<typeof mapDispatchToProps>, any>(
  undefined,
  mapDispatchToProps
)(SearchLayout);
