import * as React from 'react';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import CragComponent from './Crag';
import { State } from '../../reducer';
import { selectArea } from '../../ducks/explorer';
import fetchCrags from '../../ducks/operations/fetchCrags';
import { CragSchema } from '../../normalizr';
import Area from '../../../models/Area';
import Crag from '../../../models/Crag';
import scopeObject from '../../ducks/util/scopeObject';
import { setOpen } from '../../ducks/sidebar';

interface OwnProps {
  name: string;
}

/**
 * Defer the rendering of crag until we've loaded data
 */
class DeferredCrag extends React.Component<StateProps & OwnProps & DispatchProps> {

  componentDidMount() {
    if (!this.props.crag) {
      this.props.fetchCrags();
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
}

const mapStateToProps = (state: State, props: OwnProps) => {
  return {
    selectedAreaId: state.explorer.selectedAreaId,
    crag: denormalize(
      props.name,
      CragSchema,
      state.entities
    )
  };
};

const mapDispatchToProps = {
  onAreaClick: (area: Area) => {
    return selectArea(area.name);
  },
  fetchCrags: fetchCrags('singleton-fetch'),
  onOpenSidebar: () => {
    return scopeObject(
      setOpen(true),
      'singleton-sidebar'
    );
  }
};

type StateProps = {
  selectedAreaId: string;
  crag: Crag;
};
type DispatchProps = {
  onAreaClick: (area: Area) => any;
  onOpenSidebar: () => any;
  fetchCrags: () => any;
};
export default connect<StateProps, DispatchProps, any>(
  mapStateToProps,
  mapDispatchToProps
)(DeferredCrag);
