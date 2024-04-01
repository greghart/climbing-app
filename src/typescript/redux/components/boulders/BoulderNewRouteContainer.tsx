import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";
import Bluebird from "bluebird";
import { replace } from "connected-react-router";

import RouteForm, { type Props as FormProps } from "../routes/RouteForm";
import type { MapDispatchToPropsFunction } from "../types";
import createRoute from "../../ducks/operations/createRoute";
import handleReduxFormErrors from "../util/handleReduxFormErrors";
import Boulder from "../../../models/Boulder";
import _debug from "../../../debug";
const debug = _debug.extend(
  "redux/components/boulders/BoulderNewRouteContainer"
);

interface OwnProps {
  boulder: Boulder;
}

// Use one form for all routes -- for now we assume one at a time.
const form = "route-form";

type MapDispatchToProps = MapDispatchToPropsFunction<
  Partial<FormProps>,
  OwnProps
>;
const mapDispatchToProps: MapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      debug(data, "submitted");
      return Bluebird.resolve(dispatch(createRoute(ownProps.boulder, data)))
        .then(() => {
          return dispatch(replace(`/boulders/${ownProps.boulder.id}`));
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
)(RouteForm) as React.ComponentType<OwnProps>;
