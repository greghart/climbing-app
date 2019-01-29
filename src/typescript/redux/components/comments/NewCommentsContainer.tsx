import { reduxForm, submit, getFormSubmitErrors, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import * as Bluebird from 'bluebird';

import NewComment, { Props as FormProps } from './NewComment';
import User from '../../../models/User';
import createCommentForRoute from '../../ducks/operations/createCommentForRoute';
import { compose } from 'redux';
import { MapDispatchToPropsFunction } from '../types';
import Commentable from '../../../models/Commentable';

interface OwnProps {
  entity: {
    id: number | string,
    commentable?: Commentable;
  },
  user: User,
  // a unique name for the form -- we can scope this as needed
  form: string
}

// Form object for run-time validation
const mapDispatchToProps: MapDispatchToPropsFunction<Partial<FormProps>, OwnProps> = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      return Bluebird.resolve(
        dispatch(
          createCommentForRoute(ownProps.myRoute, data.text)
        )
      )
      .catch((err) => {
        if (!(err instanceof SubmissionError)) {
          throw new SubmissionError({
            _error: err.message
          });
        }
        throw err;
      });
    },
    handleCustomSubmit: () => {
      dispatch(submit(form))
    }
  };
};

export default compose(
  connect<{}, typeof mapDispatchToProps>(
    undefined,
    mapDispatchToProps
  ),
  reduxForm({
    form
  })
)(RouteNewComment);

