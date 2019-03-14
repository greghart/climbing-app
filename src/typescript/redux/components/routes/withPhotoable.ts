import { compose } from 'redux';
import { denormalize } from 'normalizr';
import isObject = require('lodash/isObject');

import { fetchPhotoableForRoute } from '../../ducks/operations/fetchPhotoable';
import Route from '../../../models/Route';
import { InferableComponentEnhancerWithProps } from 'react-redux';
import asyncComponent from '../../decorators/asyncComponent';
import { PhotoableSchema } from '../../normalizr';
import { createSelector } from 'reselect';
import { State, selectors } from '../../reducer';
import Photoable from '../../../models/Photoable';

interface OwnProps {
  myRoute: Route;
}

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  if (!ownProps.myRoute.photoable) {
    return { photoable: undefined };
  }
  const selectRoute = (state: State, props: OwnProps) => props.myRoute;
  const selectPhotoable = (entities, myRoute) => denormalize(
    myRoute.photoable,
    PhotoableSchema,
    entities,
  );
  const getPhotoable = createSelector<State, OwnProps, any, Route, Photoable>(
    selectors.selectEntities,
    selectRoute,
    selectPhotoable,
  );
  return {
    photoable: getPhotoable(state, ownProps)
  };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetch: () => dispatch(
      fetchPhotoableForRoute(ownProps.myRoute)
    ),
  };
};

/**
 * Simple decorator to fetch a myRoute's photoable on mount
 */
function withPhotoable<P>(
  component: React.ComponentType<P>
) {
  return asyncComponent<
    ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps>,
    OwnProps
  >(
    mapStateToProps,
    mapDispatchToProps,
    (props) => {
      return isObject(props.photoable);
    }
  )(component);
}

export default withPhotoable;
