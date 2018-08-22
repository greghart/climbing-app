import { goBack } from 'connected-react-router';
import { connect } from 'react-redux';

import SearchLayout from './SearchLayout';

const mapDispatchToProps = (dispatch) => {
  return {
    onClickBack: () => {
      return dispatch(goBack());
    },
  };
};

export default connect<any, typeof mapDispatchToProps, any>(
  null,
  mapDispatchToProps
)(SearchLayout);
