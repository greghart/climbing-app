import { compose } from 'redux';
import { connect } from 'react-redux';

import RouteLayout from './RouteLayout';
import { State } from '../../reducer';
import { denormalize } from 'normalizr';
import { RouteSchema, BoulderSchema, CragSchema, AreaSchema } from '../../normalizr';
import withLoader from '../../decorators/withLoader';
import withMountAction from '../../decorators/withMountAction';
import fetchRoute from '../../ducks/operations/fetchRoute';

interface OwnProps {
  cragId: string,
  areaId: string,
  boulderId: string,
  routeId: string
}

/**
 * Container around search results.
 */
const mapStateToProps = (state: State, ownProps: OwnProps) => {
  console.warn({ ownProps }, 'RouteLayoutContainer.mapStateToProps');
  const route = denormalize(
    ownProps.routeId,
    RouteSchema,
    state.entities
  );
  if (!route) {
    return {};
  }
  return {
    route: {
      ...denormalize(
        ownProps.routeId,
        RouteSchema,
        state.entities
      ),
      boulder: {
        ...denormalize(
          ownProps.boulderId,
          BoulderSchema,
          state.entities
        ),
        area: {
          ...denormalize(
            ownProps.areaId,
            AreaSchema,
            state.entities
          ),
          crag: denormalize(
            ownProps.cragId,
            CragSchema,
            state.entities
          )
        }
      }
    }
  };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetchRoute: () => dispatch(
      fetchRoute('singleton-fetch')({ id: ownProps.routeId })
    ),
  };
};

type Props = ReturnType<typeof mapStateToProps>;

export default compose(
  connect<Props, ReturnType<typeof mapDispatchToProps>, OwnProps>(
    mapStateToProps,
    mapDispatchToProps
  ),
  withMountAction(
    (props) => {
      if (!props.route) {
        props.fetchRoute();
      }
    }
  ),
  withLoader<Props>(
    (props) => !props.route
  )
)(RouteLayout);
