import { reduxForm, submit } from 'redux-form';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

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

// Form object for run-time validation
const mapDispatchToProps: MapDispatchToPropsFunction<Partial<FormProps>, OwnProps> = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      return dispatch(
        createCommentForRoute({ text: data.text, user: ownProps.user, route: ownProps.myRoute })
      );
    },
    handleCustomSubmit: () => {
      dispatch(submit('route-comment-form'))
    }
  };
};

export default compose(
  connect<{}, typeof mapDispatchToProps>(
    undefined,
    mapDispatchToProps
  ),
  reduxForm({
    // a unique name for the form
    form: 'route-comment-form'
  })
)(RouteNewComment);
