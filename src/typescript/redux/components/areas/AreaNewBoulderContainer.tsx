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

const BoulderFormWarning: React.SFC<any> = (props) => {
  return (
    <React.Fragment>
      <p className="text-danger">Boulder creation currently requires location, which is yet to be setup</p>
      <BoulderForm {...props} />
    </React.Fragment>
  )
};

interface OwnProps {
  area: Area,
}

// Use one form for all boulders -- for now we assume one at a time.
const form = 'boulder-form';

const mapDispatchToProps: MapDispatchToPropsFunction<Partial<FormProps>, OwnProps> = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      console.log(data, 'submitted')
      return Bluebird.resolve(
        dispatch(
          createBoulder(ownProps.area, data)
        )
      )
      .then(() => {
        return dispatch(
          replace(`/areas/${ownProps.area.id}`)
        );
      })
      .catch(handleReduxFormErrors);
    }
  };
};

export default compose<React.ComponentType, React.ComponentType, React.ComponentType>(
  connect(
    undefined,
    mapDispatchToProps
  ),
  reduxForm({
    form
  })
)(BoulderFormWarning) as React.ComponentType<OwnProps>;
