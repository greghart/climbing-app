import * as React from 'react';
import { Component, SFC } from 'react';
import { Map } from 'react-leaflet';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import CragComponent from '../components/explorer/Crag';
import { State } from '../reducer';
import { selectArea } from '../ducks/explorer';
import { CragSchema } from '../normalizr';
import { addEntities } from '../ducks/entities';
import Area from '../../models/Area';
import Crag from '../../models/Crag';
const tram = require('../../../../static/data/TramData.json');
const santee = require('../../../../static/data/Santee.json');

interface OwnProps {
  name: string;
}

/**
 * Defer the rendering of crag until we've loaded data
 */
class DeferredCrag extends Component<StateProps & OwnProps & DispatchProps> {

  componentDidMount() {
    if (!this.props.crag) {
      let data: any;
      console.log(this.props.name);
      switch (this.props.name) {
        case 'TramWay':
          data = tram;
          break;
        default:
          data = santee;
      }
      this.props.loadCragFromJSON(data);
    }
  }

  render() {
    if (!this.props.crag) {
      return <span>Loading...</span>;
    }
    return (
      <CragComponent {...this.props} />
    );
  }
};

const mapStateToProps = (state: State, props: OwnProps) => {
  return {
    selectedAreaId: state.explorer.selectedAreaId,
    crag: denormalize(
      props.name,
      CragSchema,
      state.entities
    )
  };
}

const mapDispatchToProps = {
  onAreaClick: (area: Area) => {
    return selectArea(area.name);
  },
  loadCragFromJSON: (json: any) => {
    return addEntities({
      entities: json,
      schema: CragSchema
    })
  }
}

type StateProps = {
  selectedAreaId: string;
  crag: Crag;
};
type DispatchProps = {
  onAreaClick: (area: Area) => any;
  loadCragFromJSON: any;
}
export default connect<StateProps, DispatchProps, any>(
  mapStateToProps,
  mapDispatchToProps
)(DeferredCrag);

