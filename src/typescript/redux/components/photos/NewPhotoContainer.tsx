import { reduxForm, submit, SubmissionError } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";
import Bluebird from "bluebird";

import NewPhoto, { type Props as FormProps } from "./NewPhoto.js";
import User from "../../../models/User.js";
import type { MapDispatchToPropsFunction } from "../types.js";
import Photoable from "../../../models/Photoable.js";
import createPhoto from "../../ducks/operations/createPhoto.js";
import handleReduxFormErrors from "../util/handleReduxFormErrors.js";
import { replace } from "connected-react-router";

interface OwnProps {
  photoable: Photoable;
  user: User;
  // Where to redirect to after creation
  redirect: string;
}

// Use one form for all "photoable" -- for now we assume one at a time.
const form = "photoable-form";

type MapDispatchToProps = MapDispatchToPropsFunction<
  Partial<FormProps>,
  OwnProps
>;
const mapDispatchToProps: MapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      return Bluebird.resolve(dispatch(createPhoto(ownProps.photoable, data)))
        .then(() => {
          return dispatch(replace(ownProps.redirect));
        })
        .catch(handleReduxFormErrors);
    },
    handleCustomSubmit: () => {
      dispatch(submit(form));
    },
  };
};

export default compose(
  connect(undefined, mapDispatchToProps),
  reduxForm({
    form,
  })
)(NewPhoto) as React.ComponentType<OwnProps>;
