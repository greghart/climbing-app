import * as React from "react";
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";
import Bluebird from "bluebird";
import { replace } from "connected-react-router";

import BoulderForm, {
  type Props as FormProps,
} from "../boulders/BoulderForm.js";
import type { MapDispatchToPropsFunction } from "../types.js";
import createBoulder from "../../ducks/operations/createBoulder.js";
import handleReduxFormErrors from "../util/handleReduxFormErrors.js";
import Area from "../../../models/Area.js";
import _debug from "../../../debug.js";
const debug = _debug.extend("redux/components/areas/AreaNewBoulderContainer");

interface OwnProps {
  area: Area;
}

// Use one form for all boulders -- for now we assume one at a time.
const form = "boulder-form";

type MapDispatchToProps = MapDispatchToPropsFunction<
  Partial<FormProps>,
  OwnProps
>;
const mapDispatchToProps: MapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      debug(data, "submitted");
      return Bluebird.resolve(dispatch(createBoulder(ownProps.area, data)))
        .then(() => {
          return dispatch(replace(`/areas/${ownProps.area.id}`));
        })
        .catch(handleReduxFormErrors);
    },
  };
};

export default compose(
  connect(undefined, mapDispatchToProps),
  reduxForm({
    form,
  })
)(BoulderForm) as React.ComponentType<OwnProps>;
