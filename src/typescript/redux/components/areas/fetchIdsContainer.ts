import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import intersection = require('lodash/intersection');
import map = require('lodash/map');

import { State, selectors } from '../../reducer';
import { AreaSchema } from '../../normalizr';
import fetchAreas from '../../ducks/operations/fetchAreas';
import Area from '../../../models/Area';
import asyncComponent from '../../decorators/asyncComponent';
import selectNormalizr from '../../util/selectNormalizr';

/**
 * Decorator to fetch needed data for a list of area ids
 */

interface OwnProps {
  areaIds: string[]
};

const selectProps = (state: State, props: OwnProps) => props.areaIds
const selectAreas = (entities: State['entities'], areaIds: string[]) => denormalize(
  areaIds,
  selectNormalizr(
    [AreaSchema],
    { coordinates: false }
  ),
  entities
)

const getAreas = createSelector<State, OwnProps, any, string[], Area[]>(
  selectors.selectEntities,
  selectProps,
  selectAreas
)

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const areas = getAreas(state, ownProps);
  console.warn({
    state,
    ownProps,
    areas
  })
  const isLoading = intersection(map(areas, (a) => a.id.toString()), ownProps.areaIds).length !== ownProps.areaIds.length;
  return {
    areas,
    isLoading
  }
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetch: () => dispatch(
      fetchAreas('singleton-fetch-areas')(ownProps.areaIds.join(','))
    ),
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;

function fetchIdsContainer<P>(component: React.ComponentType<P>) {
  return asyncComponent<StateProps, ReturnType<typeof mapDispatchToProps>, OwnProps>(
    mapStateToProps,
    mapDispatchToProps,
    (props) => (
      !props.isLoading
    )
  )(component) as unknown as React.ComponentType<OwnProps | P>;
}

export default fetchIdsContainer;
