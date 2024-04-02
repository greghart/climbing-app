import { denormalize } from "normalizr";
import { push } from "connected-react-router";

import Crag from "./Crag.js";
import type { State } from "../../reducer.js";
import fetchCrag from "../../ducks/operations/fetchCrag.js";
import { CragSchema } from "../../normalizr.js";
import Area from "../../../models/Area.js";
import scopeObject from "../../ducks/util/scopeObject.js";
import { setOpen } from "../../ducks/sidebar.js";
import withMountAction from "../../decorators/withMountAction.js";
import { compose } from "redux";
import withLoader from "../../decorators/withLoader.js";
import asyncComponent from "../../decorators/asyncComponent.js";

interface OwnProps {
  cragId: string;
  area?: string;
}

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  console.warn(
    {
      ownProps,
    },
    "CragContainer.mapStateToProps"
  );
  return {
    crag: denormalize(ownProps.cragId, CragSchema, state.entities),
  };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    // Go to area, or remove area
    onAreaClick: (area?: Area) => {
      if (area) {
        return dispatch(push(`/explorer/${ownProps.cragId}/${area.id}`));
      }
      return dispatch(push(`/explorer/${ownProps.cragId}`));
    },
    fetchCrag: () => dispatch(fetchCrag("singleton-fetch")([ownProps.cragId])),
    onCloseSidebar: () =>
      dispatch(scopeObject(setOpen(false), "singleton-sidebar")),
    onOpenSidebar: () =>
      dispatch(scopeObject(setOpen(true), "singleton-sidebar")),
    onOpenSearch: () => {
      return dispatch(push(`/search/${ownProps.cragId}`));
    },
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

const hasDependants = (props: StateProps) => props.crag && props.crag.areas;

export default asyncComponent<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  hasDependants,
  { fetchDispatch: "fetchCrag" }
)(Crag);
