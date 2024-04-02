import { denormalize } from "normalizr";
import { createSelector } from "reselect";

import { type State, selectors } from "../../reducer.js";
import { AreaSchema } from "../../normalizr.js";
import fetchAreas from "../../ducks/operations/fetchAreas.js";
import Area from "../../../models/Area.js";
import asyncComponent from "../../decorators/asyncComponent.js";
import selectNormalizr from "../../util/selectNormalizr.js";
import type { Matching } from "react-redux";
import { debounce } from "lodash-es";

interface OwnProps {
  areaId: string;
}

const selectProps = (state: State, props: OwnProps) => props.areaId;
const selectArea = (entities, areaId) =>
  denormalize(
    areaId,
    selectNormalizr(AreaSchema, {
      crag: "empty",
      boulders: true,
      commentable: true,
      polygon: true,
    }),
    entities
  );
// Single area at a time, so just use a single selector for now
const getArea = createSelector<State, OwnProps, any, string, Area>(
  selectors.selectEntities,
  selectProps,
  selectArea
);
const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return { area: getArea(state, ownProps) };
};

const runFetch = debounce((dispatch, areaId) => {
  return dispatch(fetchAreas("singleton-fetch")(areaId));
});
const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    fetch: (params: OwnProps) => {
      runFetch(dispatch, params.areaId);
    },
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
const withArea = asyncComponent<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  (props) => {
    return !!(props.area && props.area.boulders && props.area.crag);
  }
);

export default withArea;
