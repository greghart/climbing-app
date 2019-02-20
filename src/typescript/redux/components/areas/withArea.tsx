import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';

import { State, selectors } from '../../reducer';
import { AreaSchema } from '../../normalizr';
import fetchAreas from '../../ducks/operations/fetchAreas';
import Area from '../../../models/Area';
import asyncComponent from '../../decorators/asyncComponent';
import selectNormalizr from '../../util/selectNormalizr';

interface OwnProps {
  areaId: string;
}

const selectProps = (state: State, props: OwnProps) => props.areaId;
const selectArea = (entities, areaId) => denormalize(
  areaId,
  selectNormalizr(
    AreaSchema,
    { crag: 'empty', boulders: 'empty', commentable: true, polygon: true },
  ),
  entities,
);
// Single area at a time, so just use a single selector for now
const getArea = createSelector<State, OwnProps, any, string, Area>(
  selectors.selectEntities,
  selectProps,
  selectArea,
);
const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return { area: getArea(state, ownProps) };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetch: () => dispatch(
      fetchAreas('singleton-fetch')(ownProps.areaId),
    ),
  };
};

export default asyncComponent(
  mapStateToProps,
  mapDispatchToProps,
  (props) => (
    !!(props.area && props.area.boulders && props.area.crag)
  ),
);
