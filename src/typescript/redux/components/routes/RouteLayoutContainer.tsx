import { RouteConfig } from 'react-router-config';
import { denormalize } from 'normalizr';
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

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const route: Route = denormalize(
    ownProps.routeId,
    RouteSchema,
    state.entities
  );
  return { route };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetch: () => dispatch(
      fetchRoute('singleton-fetch')({ id: ownProps.routeId })
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
