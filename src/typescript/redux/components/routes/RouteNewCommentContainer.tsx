import { reduxForm, submit, getFormSubmitErrors, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import * as Bluebird from 'bluebird';

// import createComment from '../../ducks/operations/createComment';
import RouteNewComment, { Props as FormProps } from './RouteNewComment';
import User from '../../../models/User';
import Route from '../../../models/Route';
import createCommentForRoute from '../../ducks/operations/createCommentForRoute';
import { compose } from 'redux';
import { MapDispatchToPropsFunction } from '../types';

// We just need the route id for connecting
interface OwnProps {
  myRoute: Route,
  user: User
}

// a unique name for the form -- we can scope this as needed
const form = 'route-comment-form';

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
