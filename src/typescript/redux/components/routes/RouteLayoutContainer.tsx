import { compose } from 'redux';
import { connect } from 'react-redux';

import RouteLayout from './RouteLayout';
import { State } from '../../reducer';
import { denormalize } from 'normalizr';
import { RouteSchema, BoulderSchema, CragSchema, AreaSchema } from '../../normalizr';
import withLoader from '../../decorators/withLoader';
import withMountAction from '../../decorators/withMountAction';
import fetchRoute from '../../ducks/operations/fetchRoute';
import Route from '../../../models/Route';

interface OwnProps {
  routeId: string
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

const hasDependants = (props: Props) =>
  (props.route && props.route.boulder && props.route.boulder.area && props.route.boulder.area.crag)

export default compose(
  connect<Props, ReturnType<typeof mapDispatchToProps>, OwnProps>(
    mapStateToProps,
    mapDispatchToProps
  ),
  withMountAction(
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
