import { reduxForm, submit } from 'redux-form';
import { connect } from 'react-redux';

// import createComment from '../../ducks/operations/createComment';
import RouteNewComment from './RouteNewComment';
import User from '../../../models/User';
import Route from '../../../models/Route';
import createCommentForRoute from '../../ducks/operations/createCommentForRoute';
import { compose } from 'redux';

// We just need the route id for connecting
interface OwnProps {
  myRoute: Route,
  user: User
}

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    onSubmit: ({ text }: { text: string }) => {
      return dispatch(
        createCommentForRoute({ text, user: ownProps.user, route: ownProps.myRoute })
      )
      .then(() => {
        console.log('Waiting!')
      });
    },
    handleCustomSubmit: () => dispatch(submit('route-comment-form'))
  };
};

export default compose(
  connect(
    undefined,
    mapDispatchToProps
  ),
  reduxForm({
    // a unique name for the form
    form: 'route-comment-form'
  })
)(RouteNewComment);
