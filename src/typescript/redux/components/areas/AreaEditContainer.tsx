import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";
import { replace } from "connected-react-router";
import { pick } from "lodash-es";
import Bluebird from "bluebird";

import AreaForm, { type Props as FormProps } from "./AreaForm.js";
import type { MapDispatchToPropsFunction } from "../types.js";
import updateArea from "../../ducks/operations/updateArea.js";
import handleReduxFormErrors from "../util/handleReduxFormErrors.js";
import Area from "../../../models/Area.js";

interface OwnProps {
  // Area to edit
  area: Area;
}

// Use one form for all routes -- for now we assume one at a time.
const form = "area-form-edit";

const mapStateToProps = (_: unknown, ownProps: OwnProps) => {
  return {
    initialValues: pick(ownProps.area, "name", "description", "polygon"),
    area: ownProps.area,
  };
};

const mapDispatchToProps: MapDispatchToPropsFunction<
  Partial<FormProps>,
  OwnProps
> = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      return Bluebird.resolve(dispatch(updateArea(ownProps.area, data)))
        .then(() => {
          return dispatch(replace(`/areas/${ownProps.area.id}`));
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
)(AreaForm) as React.ComponentType<OwnProps>;
