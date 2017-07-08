import * as React from 'react';
import { SFC } from 'react';
import { Map } from 'react-leaflet';
import { connect } from 'react-redux';

import CragMap from '../components/explorer/CragMap';
import { State } from '../reducer';
import { Area, Crag } from '../components/explorer/types';
import { selectArea } from '../ducks/explorer';
const tramData = require('../../../../static/data/TramData.json');

const mapStateToProps = (state: State) => {
  return {
    selectedAreaId: state.explorer.selectedAreaId,
    crag: tramData
  };
}

const mapDispatchToProps = {
  onAreaClick: (area: Area) => {
    return selectArea(area.name);
  }
}

type StateProps = {
  selectedAreaId: string;
  crag: Crag;
};
type DispatchProps = {
  onAreaClick: (area: Area) => any;
}
export default connect<StateProps, DispatchProps, any>(mapStateToProps, mapDispatchToProps)(CragMap);

