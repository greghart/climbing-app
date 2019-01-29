import { State } from '../../reducer';
import fetchRoute from '../../ducks/operations/fetchRoute';
import Route from '../../../models/Route';
import asyncComponent from '../../decorators/asyncComponent';
import ShowComments from './ShowComments';
import Commentable from '../../../models/Commentable';

interface OwnProps {
  // An action to get comments
  action: (props: OwnProps) => any;
  // The commentable entity
  entity: { id: number | string, commentable?: Commentable };
  // The route to setup a new comment
  newRoute: string
}

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const entity = ownProps.entity;
  return {
    entity,
    newRoute: ownProps.newRoute,
    comments: (entity && entity.commentable && entity.commentable.comments) || []
  };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetch: () => dispatch(
      ownProps.action(ownProps)
    ),
  };
};

const ShowCommentsContainer = asyncComponent(
  mapStateToProps,
  mapDispatchToProps,
  (props) => {
    return (props.entity && props.entity.commentable !== undefined);
  }
)(ShowComments);

export default ShowCommentsContainer;
