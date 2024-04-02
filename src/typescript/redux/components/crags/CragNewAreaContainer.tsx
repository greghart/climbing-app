import { pick } from "lodash-es";
import * as React from "react";
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";
import Bluebird from "bluebird";

import AreaForm, { type Props as FormProps } from "../areas/AreaForm.js";
import type { MapDispatchToPropsFunction } from "../types.js";
import createArea from "../../ducks/operations/createArea.js";
import handleReduxFormErrors from "../util/handleReduxFormErrors.js";
import { replace } from "connected-react-router";
import Crag from "../../../models/Crag.js";

interface OwnProps {
  crag: Crag;
}

// Use one form for all areas -- for now we assume one at a time.
const form = "area-form-new";

const mapStateToProps = (_: unknown, ownProps: OwnProps) => {
  return {
    initialValues: {
      polygon: {
        coordinates: [],
      },
    },
    area: {
      id: "new",
      crag: ownProps.crag,
    },
  };
};

type MapDispatchToProps = MapDispatchToPropsFunction<
  Partial<FormProps>,
  OwnProps
>;
const mapDispatchToProps: MapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      return Bluebird.resolve(dispatch(createArea(ownProps.crag, data)))
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
  })
)(AreaForm) as React.ComponentType<OwnProps>;
