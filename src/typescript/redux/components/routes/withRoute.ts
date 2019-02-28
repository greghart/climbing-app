import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';

import { State, selectors } from '../../reducer';
import { RouteSchema } from '../../normalizr';
import fetchRoute from '../../ducks/operations/fetchRoute';
import Route from '../../../models/Route';
import asyncComponent from '../../decorators/asyncComponent';
import selectNormalizr from '../../util/selectNormalizr';

interface OwnProps {
  routeId: string;
}

const selectProps = (state: State, props: OwnProps) => props.routeId;
const query = selectNormalizr(
  RouteSchema,
  { boulder: { polygon: true, area: { crag: 'empty' } }, commentable: true },
);
const selectRoute = (entities, routeId) => denormalize(
  routeId,
  query,
  entities,
);
// Single route at a time, so just use a single selector for now
const getRoute = createSelector<State, OwnProps, any, string, Route>(
  selectors.selectEntities,
  selectProps,
  selectRoute,
);
const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return { route: getRoute(state, ownProps) };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetch: () => dispatch(
      fetchRoute('singleton-fetch')(ownProps.routeId),
    ),
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
function withRoute<P>(component: React.ComponentType<P>) {
  return asyncComponent<
    StateProps,
    DispatchProps,
    OwnProps
  >(
    mapStateToProps,
    mapDispatchToProps,
    (props) => (
      !!(
        props.route &&
        props.route.boulder &&
        props.route.boulder.area &&
        props.route.boulder.area.crag
      )
    ),
  )(component);
}

export default withRoute;
