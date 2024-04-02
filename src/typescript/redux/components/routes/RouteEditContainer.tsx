import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";
import { replace } from "connected-react-router";
import Bluebird from "bluebird";

import RouteForm, { type Props as FormProps } from "./RouteForm.js";
import type { MapDispatchToPropsFunction } from "../types.js";
// import updateRoute from '../../ducks/operations/updateRoute.js';
import handleReduxFormErrors from "../util/handleReduxFormErrors.js";
import Route from "../../../models/Route.js";
import updateRoute from "../../ducks/operations/updateRoute.js";

interface OwnProps {
  // Route to edit
  myRoute: Route;
}

// Use one form for all routes -- for now we assume one at a time.
const form = "route-form-edit";

const mapStateToProps = (_: unknown, ownProps: OwnProps) => {
  return {
    initialValues: ownProps.myRoute,
    boulder: ownProps.myRoute.boulder,
  };
};

type MapDispatchToProps = MapDispatchToPropsFunction<
  Partial<FormProps>,
  OwnProps
>;
const mapDispatchToProps: MapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      return Bluebird.resolve(dispatch(updateRoute(ownProps.myRoute, data)))
        .then(() => {
          return dispatch(replace(`/routes/${ownProps.myRoute.id}`));
        })
        .catch(handleReduxFormErrors);
    },
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form,
    enableReinitialize: true,
  })
)(RouteForm) as React.ComponentType<OwnProps>;
