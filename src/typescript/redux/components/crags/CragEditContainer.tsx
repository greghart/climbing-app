import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'connected-react-router';
import { pick } from 'lodash';
import * as Bluebird from 'bluebird';

import CragForm, { Props as FormProps } from './CragForm';
import { MapDispatchToPropsFunction } from '../types';
import updateCrag from '../../ducks/operations/updateCrag';
import handleReduxFormErrors from '../util/handleReduxFormErrors';
import Crag from '../../../models/Crag';

interface OwnProps {
  // Crag to edit
  crag: Crag;
}

// Use one form for all routes -- for now we assume one at a time.
const form = 'crag-form-edit';

const mapStateToProps = (_: unknown, ownProps: OwnProps) => {
  return {
    initialValues: pick(ownProps.crag, 'name', 'description'),
    crag: ownProps.crag,
  };
};

type MapDispatchToProps = MapDispatchToPropsFunction<Partial<FormProps>, OwnProps>;
const mapDispatchToProps: MapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      return Bluebird.resolve(
        dispatch(
          updateCrag(ownProps.crag, data),
        ),
      )
      .then(() => {
        return dispatch(
          replace(`/crags/${ownProps.crag.id}`),
        );
      })
      .catch(handleReduxFormErrors);
    },
  };
};

export default compose<React.ComponentType, React.ComponentType, React.ComponentType>(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  reduxForm({
    form,
    enableReinitialize: false,
  }),
)(CragForm) as React.ComponentType<OwnProps>;
