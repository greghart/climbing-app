import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'connected-react-router';
import * as Bluebird from 'bluebird';

import BoulderForm, { Props as FormProps } from './BoulderForm';
import { MapDispatchToPropsFunction } from '../types';
import updateBoulder from '../../ducks/operations/updateBoulder';
import handleReduxFormErrors from '../util/handleReduxFormErrors';
import Boulder from '../../../models/Boulder';

interface OwnProps {
  // Boulder to edit
  boulder: Boulder,
}

// Use one form for all routes -- for now we assume one at a time.
const form = 'boulder-form-edit';

const mapStateToProps = (_: unknown, ownProps: OwnProps) => {
  return {
    initialValues: ownProps.boulder,
    area: ownProps.boulder.area
  };
}

const mapDispatchToProps: MapDispatchToPropsFunction<Partial<FormProps>, OwnProps> = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      return Bluebird.resolve(
        dispatch(
          updateBoulder(ownProps.boulder, data)
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form,
    enableReinitialize: true
  })
)(BoulderForm) as React.ComponentType<OwnProps>;
