import { compose } from 'redux';
import { connect } from 'react-redux';

import RouteLayout from './RouteLayout';
import { State } from '../../reducer';
import { denormalize } from 'normalizr';
import { RouteSchema, BoulderSchema, CragSchema, AreaSchema } from '../../normalizr';
import withLoader from '../../decorators/withLoader';

interface OwnProps {
  crag: string,
  area: string,
  boulder: string,
  route: string
}

/**
 * Container around search results.
 */
const mapStateToProps = (state: State, ownProps: OwnProps) => {
  console.warn({ ownProps }, 'RouteLayoutContainer.mapStateToProps');
  return {
    route: {
      ...denormalize(
        ownProps.route,
        RouteSchema,
        state.entities
      ),
      boulder: {
        ...denormalize(
          ownProps.boulder,
          BoulderSchema,
          state.entities
        ),
        area: {
          ...denormalize(
            ownProps.area,
            AreaSchema,
            state.entities
          ),
          crag: denormalize(
            ownProps.crag,
            CragSchema,
            state.entities
          )
        }
      }
    }
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

type Props = ReturnType<typeof mapStateToProps>;

export default compose(
  connect<Props, ReturnType<typeof mapDispatchToProps>, OwnProps>(
    mapStateToProps,
    mapDispatchToProps
  ),
  withLoader<Props>(
    (props) => !props.route
  )
)(RouteLayout);