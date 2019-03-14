import { reduxForm, submit, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as Bluebird from 'bluebird';

import NewPhoto, { Props as FormProps } from './NewPhoto';
import User from '../../../models/User';
import { MapDispatchToPropsFunction } from '../types';
import Photoable from '../../../models/Photoable';
import createPhoto from '../../ducks/operations/createPhoto';
import handleReduxFormErrors from '../util/handleReduxFormErrors';
import { replace } from 'connected-react-router';

interface OwnProps {
  photoable: Photoable;
  user: User;
  // Where to redirect to after creation
  redirect: string;
}

// Use one form for all "photoable" -- for now we assume one at a time.
const form = 'photoable-form';

type MapDispatchToProps = MapDispatchToPropsFunction<Partial<FormProps>, OwnProps>;
const mapDispatchToProps: MapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      return Bluebird.resolve(
        dispatch(
          createPhoto(ownProps.photoable, data),
        ),
      )
      .then(() => {
        return dispatch(
          replace(ownProps.redirect),
        );
      })
      .catch(handleReduxFormErrors);
    },
    handleCustomSubmit: () => {
      dispatch(submit(form));
    },
  };
};

export default compose<React.ComponentType, React.ComponentType, React.ComponentType>(
  connect<{}, typeof mapDispatchToProps>(
    undefined,
    mapDispatchToProps,
  ),
  reduxForm({
    form,
  }),
)(NewPhoto) as React.ComponentType<OwnProps>;
