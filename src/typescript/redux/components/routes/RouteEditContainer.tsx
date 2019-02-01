import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'connected-react-router';
import * as Bluebird from 'bluebird';

import RouteForm, { Props as FormProps } from './RouteForm';
import { MapDispatchToPropsFunction } from '../types';
// import updateRoute from '../../ducks/operations/updateRoute';
import handleReduxFormErrors from '../util/handleReduxFormErrors';
import Route from '../../../models/Route';
import updateRoute from '../../ducks/operations/updateRoute';

interface OwnProps {
  // Route to edit
  myRoute: Route,
}

// Use one form for all routes -- for now we assume one at a time.
const form = 'route-form-edit';

const mapStateToProps = (_: unknown, ownProps: OwnProps) => {
  return {
    initialValues: ownProps.myRoute
  };
}

const mapDispatchToProps: MapDispatchToPropsFunction<Partial<FormProps>, OwnProps> = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      return Bluebird.resolve(
        dispatch(
          updateRoute(ownProps.myRoute, data)
        )
      )
      .then(() => {
        return dispatch(
          replace(`/routes/${ownProps.myRoute.id}`)
        );
      })
      .catch(handleReduxFormErrors);
    }
  };
};

export default compose<React.ComponentType, React.ComponentType, React.ComponentType>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form,
    enableReinitialize: true
  })
)(RouteForm) as React.ComponentType<OwnProps>;
