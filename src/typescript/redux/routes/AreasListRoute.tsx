import { connect } from "react-redux";
import { denormalize } from "normalizr";
import type { RouteConfigComponentProps } from "react-router-config";
import { push } from "connected-react-router";
import { get } from "lodash-es";

import type { State } from "../reducer.js";
import { CragSchema } from "../normalizr.js";
import Area from "../../models/Area.js";
import AreasList from "../components/explorer/AreasList.js";

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
