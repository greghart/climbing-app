import * as React from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import * as Bluebird from 'bluebird';

import BoulderForm, { Props as FormProps } from '../boulders/BoulderForm';
import { MapDispatchToPropsFunction } from '../types';
import createBoulder from '../../ducks/operations/createBoulder';
import handleReduxFormErrors from '../util/handleReduxFormErrors';
import { replace } from 'connected-react-router';
import Area from '../../../models/Area';

interface OwnProps {
  area: Area;
}

// Use one form for all boulders -- for now we assume one at a time.
const form = 'boulder-form';

type MapDispatchToProps = MapDispatchToPropsFunction<Partial<FormProps>, OwnProps>;
const mapDispatchToProps: MapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      console.log(data, 'submitted');
      return Bluebird.resolve(
        dispatch(
          createBoulder(ownProps.area, data),
        ),
      )
      .then(() => {
        return dispatch(
          replace(`/areas/${ownProps.area.id}`),
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
)(BoulderForm) as React.ComponentType<OwnProps>;
