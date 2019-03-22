import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';

import { State, selectors } from '../../reducer';
import { AreaSchema } from '../../normalizr';
import fetchAreas from '../../ducks/operations/fetchAreas';
import Area from '../../../models/Area';
import asyncComponent from '../../decorators/asyncComponent';
import selectNormalizr from '../../util/selectNormalizr';
import { Matching } from 'react-redux';
import { debounce } from 'lodash';

interface OwnProps {
  areaId: string;
}

const selectProps = (state: State, props: OwnProps) => props.areaId;
const selectArea = (entities, areaId) => denormalize(
  areaId,
  selectNormalizr(
    AreaSchema,
    { crag: 'empty', boulders: true, commentable: true, polygon: true },
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

const runFetch = debounce((dispatch, areaId) => {
  return dispatch(fetchAreas('singleton-fetch')(areaId));
});
const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  console.log('withArea', ownProps.areaId);
  return {
    fetch: () => runFetch(dispatch, ownProps.areaId)
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
const withArea = asyncComponent<
  StateProps,
  DispatchProps,
  OwnProps
>(
  mapStateToProps,
  mapDispatchToProps,
  (props) => {
    return !!(props.area && props.area.boulders && props.area.crag);
  },
);

export default withArea;
