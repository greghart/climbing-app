import { connect, GetProps, Omit, Shared, ConnectedComponentClass } from 'react-redux';
import { denormalize } from 'normalizr';
import { push } from 'connected-react-router';

import Crag from './Crag';
import { State } from '../../reducer';
import fetchCrag from '../../ducks/operations/fetchCrag';
import { CragSchema } from '../../normalizr';
import Area from '../../../models/Area';
import scopeObject from '../../ducks/util/scopeObject';
import { setOpen } from '../../ducks/sidebar';
import withMountAction from '../../decorators/withMountAction';
import { compose } from 'redux';
import withLoader from '../../decorators/withLoader';

interface OwnProps {
  cragId: string;
  area?: string;
}

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  console.warn({
    ownProps,
  },           'CragContainer.mapStateToProps');
  return {
    selectedAreaId: ownProps.area,
    crag: denormalize(
      ownProps.cragId,
      CragSchema,
      state.entities,
    ),
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
    fetchCrag: () => dispatch(
      fetchCrag('singleton-fetch')([ownProps.cragId]),
    ),
    onCloseSidebar: () => dispatch(
      scopeObject(
        setOpen(false),
        'singleton-sidebar',
      ),
    ),
    onOpenSidebar: () => dispatch(
      scopeObject(
        setOpen(true),
        'singleton-sidebar',
      ),
    ),
    onOpenSearch: () => {
      return dispatch(push(`/search/${ownProps.cragId}`));
    },
  };
};

type Props = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

const hasDependants = (props: Props) =>
  (props.crag && props.crag.areas);

type Composed<C, StateProps, DispatchProps, OwnProps> = ConnectedComponentClass<
  C,
  Omit<
    GetProps<C>,
    keyof Shared<StateProps & DispatchProps, GetProps<C>>
  > & OwnProps
>;

// Compose confuses things -- here is an alternative syntax if we're interested.
// @todo Refactor to asyncComponent
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withMountAction<GetProps<typeof Crag>>(
    (props) => {
      if (!hasDependants(props)) {
        props.fetchCrag(props.cragId);
      }
    },
  ),
  withLoader<GetProps<typeof Crag>>(
    (props) => !hasDependants(props),
  ),
)(Crag) as Composed<typeof Crag, Props, DispatchProps, OwnProps>;
