import { reduxForm, submit, SubmissionError } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";
import Bluebird from "bluebird";

import NewComment, { type Props as FormProps } from "./NewComment.js";
import User from "../../../models/User.js";
import type { MapDispatchToPropsFunction } from "../types.js";
import Commentable from "../../../models/Commentable.js";
import createComment from "../../ducks/operations/createComment.js";
import handleReduxFormErrors from "../util/handleReduxFormErrors.js";
import { replace } from "connected-react-router";

interface OwnProps {
  commentable: Commentable;
  user: User;
  // Where to redirect to after creation
  redirect: string;
}

// Use one form for all "commentable" -- for now we assume one at a time.
const form = "commentable-form";

type MapDispatchToProps = MapDispatchToPropsFunction<
  Partial<FormProps>,
  OwnProps
>;
const mapDispatchToProps: MapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      return Bluebird.resolve(
        dispatch(createComment(ownProps.commentable, data.text))
      )
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
)(NewComment) as React.ComponentType<OwnProps>;
