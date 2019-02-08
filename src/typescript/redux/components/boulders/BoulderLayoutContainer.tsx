import { RouteConfig } from 'react-router-config';
import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import { Location } from 'history';

import BoulderLayout from './BoulderLayout';
import { State, selectors } from '../../reducer';
import { BoulderSchema } from '../../normalizr';
import fetchBoulder from '../../ducks/operations/fetchBoulder';
import Boulder from '../../../models/Boulder';
import asyncComponent from '../../decorators/asyncComponent';
import selectNormalizr from '../../util/selectNormalizr';

interface OwnProps {
  boulderId: string,
  routerConfig: RouteConfig,
  routerLocation: Location
}

const selectProps = (state: State, props: OwnProps) => props.boulderId
const selectBoulder = (entities, boulderId) => denormalize(
  boulderId,
  selectNormalizr(
    BoulderSchema,
    { area: { crag: 'empty', polygon: true }, routes: 'empty', commentable: true }
  ),
  entities
)
// Single boulder at a time, so just use a single selector for now
const getBoulder = createSelector<State, OwnProps, any, string, Boulder>(
  selectors.selectEntities,
  selectProps,
  selectBoulder
)
const mapStateToProps = (state: State, ownProps: OwnProps) => {
  console.warn({
    state, ownProps
  }, 'mapStateToProps');
  return { boulder: getBoulder(state, ownProps) };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetch: () => dispatch(
      fetchBoulder('singleton-fetch')(ownProps.boulderId)
    ),
  };
};

export default asyncComponent(
  mapStateToProps,
  mapDispatchToProps,
  (props) => (
    !!(props.boulder && props.boulder.area && props.boulder.area.crag && props.boulder.routes)
  )
)(BoulderLayout)
