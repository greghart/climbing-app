import { RouteConfig } from 'react-router-config';
import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import { Location } from 'history';

import RouteLayout from './RouteLayout';
import { State, selectors } from '../../reducer';
import { RouteSchema } from '../../normalizr';
import fetchRoute from '../../ducks/operations/fetchRoute';
import Route from '../../../models/Route';
import asyncComponent from '../../decorators/asyncComponent';
import selectNormalizr from '../../util/selectNormalizr';

interface OwnProps {
  routeId: string,
  routerConfig: RouteConfig,
  routerLocation: Location
}

const selectProps = (state: State, props: OwnProps) => props.routeId
const selectRoute = (entities, routeId) => denormalize(
  routeId,
  selectNormalizr(
    RouteSchema,
    { boulder: { polygon: true, area: { crag: 'empty' } }, commentable: true }
  ),
  entities
)
// Single route at a time, so just use a single selector for now
const getRoute = createSelector<State, OwnProps, any, string, Route>(
  selectors.selectEntities,
  selectProps,
  selectRoute
)
const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return { route: getRoute(state, ownProps) };
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
