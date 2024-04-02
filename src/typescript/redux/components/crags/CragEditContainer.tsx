import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";
import { replace } from "connected-react-router";
import { pick } from "lodash-es";
import Bluebird from "bluebird";

import CragForm, { type Props as FormProps } from "./CragForm.js";
import type { MapDispatchToPropsFunction } from "../types.js";
import updateCrag from "../../ducks/operations/updateCrag.js";
import handleReduxFormErrors from "../util/handleReduxFormErrors.js";
import Crag from "../../../models/Crag.js";

interface OwnProps {
  // Crag to edit
  crag: Crag;
}

// Use one form for all routes -- for now we assume one at a time.
const form = "crag-form-edit";

const mapStateToProps = (_: unknown, ownProps: OwnProps) => {
  return {
    initialValues: pick(ownProps.crag, "name", "description"),
    crag: ownProps.crag,
  };
};

type MapDispatchToProps = MapDispatchToPropsFunction<
  Partial<FormProps>,
  OwnProps
>;
const mapDispatchToProps: MapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      return Bluebird.resolve(dispatch(updateCrag(ownProps.crag, data)))
        .then(() => {
          return dispatch(replace(`/crags/${ownProps.crag.id}`));
        })
        .catch(handleReduxFormErrors);
    },
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form,
    enableReinitialize: false,
  })
)(CragForm) as React.ComponentType<OwnProps>;
