import { denormalize } from "normalizr";
import { createSelector } from "reselect";

import { type State, selectors } from "../../reducer";
import { CragSchema } from "../../normalizr";
import fetchCrag from "../../ducks/operations/fetchCrag";
import Crag from "../../../models/Crag";
import asyncComponent from "../../decorators/asyncComponent";
import selectNormalizr from "../../util/selectNormalizr";

/**
 * Decorator to fetch needed data for a crag
 */

type Id = number | string;
interface OwnProps {
  // Id or name
  cragId: Id;
}

const selectProps = (state: State, props: OwnProps) => props.cragId;
const selectCrag = (entities: State["entities"], cragId: Id) =>
  denormalize(
    cragId,
    selectNormalizr(CragSchema, { areas: "empty", commentable: true }),
    entities
  );

const getCrag = createSelector<State, OwnProps, any, Id, Crag>(
  selectors.selectEntities,
  selectProps,
  selectCrag
);

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const crag = getCrag(state, ownProps);
  // @todo Need to add "managed" loading state
  // It's no longer enough to check what data exists, since we may have some areas but not others,
  // and we can't know. Currently we use a flag from the direct operation we want, but that is hacky
  const isLoaded = crag && crag._isLoaded;
  return {
    crag,
    isLoading: !isLoaded,
  };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetch: () => dispatch(fetchCrag("singleton-fetch-crag")(ownProps.cragId)),
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
const fetchCragContainer = asyncComponent<
  StateProps,
  ReturnType<typeof mapDispatchToProps>,
  OwnProps
>(mapStateToProps, mapDispatchToProps, (props) => !props.isLoading);

export default fetchCragContainer;
