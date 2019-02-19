import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as Bluebird from 'bluebird';

import RouteForm, { Props as FormProps } from '../routes/RouteForm';
import { MapDispatchToPropsFunction } from '../types';
import createRoute from '../../ducks/operations/createRoute';
import handleReduxFormErrors from '../util/handleReduxFormErrors';
import { replace } from 'connected-react-router';
import Boulder from '../../../models/Boulder';

interface OwnProps {
  boulder: Boulder;
}

// Use one form for all routes -- for now we assume one at a time.
const form = 'route-form';

type MapDispatchToProps = MapDispatchToPropsFunction<Partial<FormProps>, OwnProps>;
const mapDispatchToProps: MapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      console.log(data, 'submitted');
      return Bluebird.resolve(
        dispatch(
          createRoute(ownProps.boulder, data),
        ),
      )
      .then(() => {
        return dispatch(
          replace(`/boulders/${ownProps.boulder.id}`),
        );
      })
      .catch(handleReduxFormErrors);
    },
  };
};

export default compose<React.ComponentType, React.ComponentType, React.ComponentType>(
  connect(
    undefined,
    mapDispatchToProps,
  ),
  reduxForm({
    form,
  }),
)(RouteForm) as React.ComponentType<OwnProps>;
