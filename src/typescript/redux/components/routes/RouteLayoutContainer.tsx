import { compose } from 'redux';
import { connect } from 'react-redux';
import { RouteConfig } from 'react-router-config';
import { denormalize } from 'normalizr';
import { Location } from 'history';

import RouteLayout from './RouteLayout';
import { State } from '../../reducer';
import { RouteSchema } from '../../normalizr';
import withLoader from '../../decorators/withLoader';
import withMountAction from '../../decorators/withMountAction';
import fetchRoute from '../../ducks/operations/fetchRoute';
import Route from '../../../models/Route';
import { Dispatch } from 'react';

interface OwnProps {
  routeId: string,
  routerConfig: RouteConfig,
  routerLocation: Location
}

/**
 * Container around search results.
 */
const mapStateToProps = (state: State, ownProps: OwnProps) => {
  console.warn({ ownProps }, 'RouteLayoutContainer.mapStateToProps');
  const route: Route = denormalize(
    ownProps.routeId,
    RouteSchema,
    state.entities
  );
  return { route };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetchRoute: () => dispatch(
      fetchRoute('singleton-fetch')({ id: ownProps.routeId })
    ),
  };
};

type Props = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

const hasDependants = (props: Props) =>
  (props.route && props.route.boulder && props.route.boulder.area && props.route.boulder.area.crag)

export default compose(
  connect<Props, DispatchProps, OwnProps>(
    mapStateToProps,
    mapDispatchToProps
  ),
  withMountAction<Props & DispatchProps>(
    (props) => {
      if (!hasDependants(props)) {
        props.fetchRoute();
      }
    }
  ),
  withLoader<Props>(
    (props) => !hasDependants(props)
  )
)(RouteLayout);
