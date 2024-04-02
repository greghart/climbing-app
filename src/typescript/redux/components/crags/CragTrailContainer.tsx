import { denormalize } from "normalizr";
import Bluebird from "bluebird";
import { connect } from "react-redux";
import { replace } from "connected-react-router";

import withTrail from "./withTrail.js";
import CragTrail, { type Props as FormProps } from "./CragTrail.js";
import type { State } from "../../reducer.js";
import Crag from "../../../models/Crag.js";
import { TrailSchema } from "../../normalizr.js";
import handleReduxFormErrors from "../util/handleReduxFormErrors.js";
import updateCrag from "../../ducks/operations/updateCrag.js";
import type { MapDispatchToPropsFunction } from "../types.js";
import fetchTrail from "../../ducks/operations/fetchTrail.js";

interface OwnProps {
  crag: Crag;
}

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    initialValues: {
      trail: denormalize(ownProps.crag.trail, TrailSchema, state.entities),
    },
  };
};

type MapDispatchToProps = MapDispatchToPropsFunction<
  Partial<FormProps>,
  OwnProps
>;
const mapDispatchToProps: MapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (data) => {
      return Bluebird.resolve(
        dispatch(
          updateCrag(ownProps.crag, {
            ...ownProps.crag,
            trail: data.trail,
          })
        )
      )
        .then(() => {
          return dispatch(fetchTrail(ownProps.crag.id));
        })
        .then(() => {
          return dispatch(replace(`/crags/${ownProps.crag.id}`));
        })
        .catch(handleReduxFormErrors);
    },
  };
};

const CragTrailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTrail()(CragTrail));

export default CragTrailContainer;
