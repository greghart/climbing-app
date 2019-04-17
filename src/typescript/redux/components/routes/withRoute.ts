import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import every from 'lodash/every';

import { State, selectors } from '../../reducer';
import { RouteSchema } from '../../normalizr';
import fetchRoute from '../../ducks/operations/fetchRoute';
import Route from '../../../models/Route';
import asyncComponent from '../../decorators/asyncComponent';
import selectNormalizr, { SchemaDescription } from '../../util/selectNormalizr';

interface OwnProps {
  routeId: string;
}

function buildSelector(query: SchemaDescription) {

  const querySelector = selectNormalizr(
    RouteSchema,
    query
  );

  const selectProps = (state: State, props: OwnProps) => props.routeId;
  const selectRoute = (entities, routeId) => denormalize(
    routeId,
    querySelector,
    entities,
  );
  const getRoute = createSelector<State, OwnProps, any, string, Route>(
    selectors.selectEntities,
    selectProps,
    selectRoute,
  );

  return getRoute;

}

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetch: () => dispatch(
      fetchRoute('singleton-fetch')(ownProps.routeId),
    ),
  };
};

type DispatchProps = ReturnType<typeof mapDispatchToProps>;
function withRoute(
  query: SchemaDescription = {
    boulder: { polygon: true, area: { crag: 'empty' } },
    commentable: true
  }
) {
  const getRoute = buildSelector(query);
  const mapStateToProps = (state: State, ownProps: OwnProps) => {
    return { route: getRoute(state, ownProps) };
  };
  type StateProps = ReturnType<typeof mapStateToProps>;
  // const hasDependants = (props: StateProps) => {
  //   console.log('hasDependants', props, Object.keys(query))
  //   return props.route && every(
  //     Object.keys(query),
  //     (thisProperty) => {
  //       console.log(!!props.route[thisProperty]);
  //       return !!props.route[thisProperty];
  //     }
  //   );
  // };
  const hasDependants = (props: StateProps) => {
    return !!(
      props.route &&
      props.route.boulder &&
      props.route.boulder.area &&
      props.route.boulder.area.crag
    );
  };

  return asyncComponent<
    StateProps,
    DispatchProps,
    OwnProps
  >(
    mapStateToProps,
    mapDispatchToProps,
    hasDependants
  );
}

export default withRoute;
