import * as React from 'react';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import { RouteConfigComponentProps, RouteConfig } from 'react-router-config';
import { push } from 'connected-react-router';
import get = require('lodash/get');

import { State } from '../reducer';
import { CragSchema } from '../normalizr';
import Area from '../../models/Area';
import AreasList from '../components/explorer/AreasList';

interface AreasListParams {
  crag: string;
  area: string;
}
type OwnProps = RouteConfigComponentProps<AreasListParams>;
// const DeferredAreaList: SFC<AreasListProps & RouteConfigComponentProps<CragParams & AreasListParams>> = (props) => {
//   return (
//     <AreasList 
//       areas={props.areas}
//       onAreaClick={props.}
//       selectedAreaId={props.match.params.area}
//     />
//   )
// }

type StateProps = {
  selectedAreaId: string;
  areas: Area[];
};
const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => {
  console.warn({
    ownProps
  }, 'mapStateToProps');
  return {
    selectedAreaId: ownProps.match.params.area,
    areas: get(
      denormalize(
        ownProps.match.params.crag,
        CragSchema,
        state.entities
      ),
      'areas',
      []
    )
  };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  const params = ownProps.match.params;
  return {
    onAreaClick: (area: Area) => {
      return dispatch(push(`/explorer/${params.crag}/${area.name}`));
    }
  };
};

export default connect<StateProps, typeof mapDispatchToProps, any>(
  mapStateToProps,
  mapDispatchToProps
)(AreasList);
