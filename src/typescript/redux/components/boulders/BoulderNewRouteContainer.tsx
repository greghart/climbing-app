import { reduxForm, submit, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as Bluebird from 'bluebird';

import NewRoute, { Props as FormProps } from './NewRoute';
import { MapDispatchToPropsFunction } from '../types';
import createRoute from '../../ducks/operations/createRoute';
import handleReduxFormErrors from '../util/handleReduxFormErrors';
import { replace } from 'connected-react-router';
import Boulder from '../../../models/Boulder';
import User from '../../../models/User';

interface OwnProps {
  boulder: Boulder,
  user: User,
  // Where to redirect to after creation
  redirect: string;
}

// Use one form for all routes -- for now we assume one at a time.
const form = 'route-form';

const mapDispatchToProps: MapDispatchToPropsFunction<Partial<FormProps>, OwnProps> = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      console.log(data, 'submitted')
      return Bluebird.resolve(
        dispatch(
          createRoute(ownProps.boulder, data)
        )
      )
      .then(() => {
        return dispatch(
          replace(`/boulders/${ownProps.boulder.id}`)
        );
      })
      .catch(handleReduxFormErrors);
    }
  };
};

export default compose<React.ComponentType, React.ComponentType, React.ComponentType>(
  connect<{}, typeof mapDispatchToProps>(
    undefined,
    mapDispatchToProps
  ),
  reduxForm({
    form
  })
)(NewRoute) as React.ComponentType<OwnProps>;
