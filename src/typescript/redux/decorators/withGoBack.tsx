/**
 * A decorator that will provide a `goBack` prop that will go back a page
 */
import * as React from 'react';
import { goBack } from 'connected-react-router';
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch) => {
  return {
    goBack: () => {
      return dispatch(goBack());
    }
  };
};

export default connect(
  undefined,
  mapDispatchToProps
);
