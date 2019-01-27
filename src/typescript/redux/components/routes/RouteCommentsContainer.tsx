import { State } from '../../reducer';
import fetchRoute from '../../ducks/operations/fetchRoute';
import Route from '../../../models/Route';
import asyncComponent from '../../decorators/asyncComponent';
import RouteComments from './RouteComments';

// We just need the route id for connecting
interface OwnProps {
  myRoute: Route,
}

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const route = ownProps.myRoute;
  return {
    route,
    comments: (route && route.commentable && route.commentable.comments) || []
  };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetch: () => dispatch(
      fetchRoute('singleton-fetch')(ownProps.myRoute.id, true)
    ),
  };
};

export default asyncComponent(
  mapStateToProps,
  mapDispatchToProps,
  (props) => {
    console.warn(props, 'RouteCommentsContainer')
    return (props.route && props.route.commentable !== undefined);
  }
)(RouteComments);
