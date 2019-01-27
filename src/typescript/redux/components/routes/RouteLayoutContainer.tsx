import { RouteConfig } from 'react-router-config';
import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import { Location } from 'history';

import RouteLayout from './RouteLayout';
import { State } from '../../reducer';
import { RouteSchema } from '../../normalizr';
import fetchRoute from '../../ducks/operations/fetchRoute';
import Route from '../../../models/Route';
import asyncComponent from '../../decorators/asyncComponent';

interface OwnProps {
  routeId: string,
  routerConfig: RouteConfig,
  routerLocation: Location
}

const selectEntities = (state: State) => state.entities
const selectProps = (state: State, props: OwnProps) => props.routeId
const selectRoute = (entities, routeId) => denormalize(
  routeId,
  RouteSchema,
  entities
)
// Single route at a time, so just use a single selector for now
const getRoute = createSelector<State, OwnProps, any, string, Route>(
  selectEntities,
  selectProps,
  selectRoute
)
const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return { route: getRoute(state, ownProps) };
  // return {
  //   route: selectRoute(
  //     selectEntities(state),
  //     selectProps(state, ownProps)
  //   )
  // }
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetch: () => dispatch(
      fetchRoute('singleton-fetch')(ownProps.routeId)
    ),
  };
};

export default asyncComponent(
  mapStateToProps,
  mapDispatchToProps,
  (props) => (
    !!(props.route && props.route.boulder && props.route.boulder.area && props.route.boulder.area.crag)
  )
)(RouteLayout)
