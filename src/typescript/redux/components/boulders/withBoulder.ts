import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';

import { State, selectors } from '../../reducer';
import { BoulderSchema } from '../../normalizr';
import fetchBoulder from '../../ducks/operations/fetchBoulder';
import Boulder from '../../../models/Boulder';
import asyncComponent from '../../decorators/asyncComponent';
import selectNormalizr from '../../util/selectNormalizr';

interface OwnProps {
  boulderId: string;
}
const query = selectNormalizr(
  BoulderSchema,
  { area: { crag: 'empty', polygon: true }, routes: 'empty', commentable: true },
);

const selectProps = (state: State, props: OwnProps) => props.boulderId;
const selectBoulder = (entities, boulderId) => denormalize(
  boulderId,
  query,
  entities,
);
// Single boulder at a time, so just use a single selector for now
const getBoulder = createSelector<State, OwnProps, any, string, Boulder>(
  selectors.selectEntities,
  selectProps,
  selectBoulder,
);
const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return { boulder: getBoulder(state, ownProps) };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetch: () => dispatch(
      fetchBoulder('singleton-fetch')(ownProps.boulderId),
    ),
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
const withBoulder = asyncComponent<
  StateProps,
  DispatchProps,
  OwnProps
>(
  mapStateToProps,
  mapDispatchToProps,
  (props) => (
    !!(props.boulder && props.boulder.area && props.boulder.area.crag && props.boulder.routes)
  ),
);

export default withBoulder;
