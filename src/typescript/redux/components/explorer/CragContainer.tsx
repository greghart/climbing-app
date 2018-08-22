import * as React from 'react';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import { push } from 'connected-react-router';

import CragComponent, { Props as CragComponentProps } from './Crag';
import { State } from '../../reducer';
import fetchCrags from '../../ducks/operations/fetchCrags';
import { selectArea } from '../../ducks/explorer';
import { CragSchema } from '../../normalizr';
import Area from '../../../models/Area';
import Crag from '../../../models/Crag';
import scopeObject from '../../ducks/util/scopeObject';
import { setOpen } from '../../ducks/sidebar';

interface OwnProps {
  crag: string;
  area?: string;
}

/**
 * Defer the rendering of crag until we've loaded data
 */
class DeferredCrag extends React.Component<DispatchProps & CragComponentProps> {

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

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  console.warn({
    ownProps
  }, 'CragContainer.mapStateToProps');
  return {
    selectedAreaId: ownProps.area,
    crag: denormalize(
      ownProps.crag,
      CragSchema,
      state.entities
    )
  };
};

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    onAreaClick: (area: Area) => {
      return dispatch(push(`/explorer/${ownProps.crag}/${area.name}`));
    },
    fetchCrags: () => dispatch(
      fetchCrags('singleton-fetch')()
    ),
    onOpenSidebar: () => dispatch(
      scopeObject(
        setOpen(true),
        'singleton-sidebar'
      )
    )
  };
};

type StateProps = {
  selectedAreaId: string;
  crag: Crag;
};
type DispatchProps = {
  onOpenSidebar: () => any;
  fetchCrags: () => any;
};
export { OwnProps };
export default connect<StateProps, typeof mapDispatchToProps, any>(
  mapStateToProps,
  mapDispatchToProps
)(DeferredCrag);
