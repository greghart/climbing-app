import * as React from "react";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import type { RouteConfigComponentProps } from "react-router-config";
import { push } from "connected-react-router";
import get from "lodash/get";

import type { State } from "../reducer";
import { CragSchema } from "../normalizr";
import Area from "../../models/Area";
import AreasList from "../components/explorer/AreasList";

interface AreasListParams {
  crag: string;
  area: string;
}
type OwnProps = RouteConfigComponentProps<AreasListParams>;
type StateProps = {
  selectedAreaId: string;
  areas: Area[];
};
const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => {
  return {
    selectedAreaId: ownProps.match.params.area,
    areas: get(
      denormalize(ownProps.match.params.crag, CragSchema, state.entities),
      "areas",
      []
    ),
  };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  const params = ownProps.match.params;
  return {
    onAreaClick: (area: Area) => {
      return dispatch(push(`/explorer/${params.crag}/${area.id}`));
    },
  };
};

export default connect<StateProps, typeof mapDispatchToProps, any>(
  mapStateToProps,
  mapDispatchToProps
)(AreasList);
