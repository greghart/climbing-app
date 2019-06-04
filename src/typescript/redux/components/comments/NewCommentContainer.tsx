import { reduxForm, submit, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Bluebird from 'bluebird';

import NewComment, { Props as FormProps } from './NewComment';
import User from '../../../models/User';
import { MapDispatchToPropsFunction } from '../types';
import Commentable from '../../../models/Commentable';
import createComment from '../../ducks/operations/createComment';
import handleReduxFormErrors from '../util/handleReduxFormErrors';
import { replace } from 'connected-react-router';

interface OwnProps {
  commentable: Commentable;
  user: User;
  // Where to redirect to after creation
  redirect: string;
}

// Use one form for all "commentable" -- for now we assume one at a time.
const form = 'commentable-form';

type MapDispatchToProps = MapDispatchToPropsFunction<Partial<FormProps>, OwnProps>;
const mapDispatchToProps: MapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      return Bluebird.resolve(
        dispatch(
          createComment(ownProps.commentable, data.text),
        ),
      )
      .then(() => {
        return dispatch(
          replace(ownProps.redirect),
        );
      })
      .catch(handleReduxFormErrors);
    },
    handleCustomSubmit: () => {
      dispatch(submit(form));
    },
  };
};

export default compose(
  connect(
    undefined,
    mapDispatchToProps,
  ),
  reduxForm({
    form,
  }),
)(NewComment) as React.ComponentType<OwnProps>;
