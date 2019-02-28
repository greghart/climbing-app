import * as React from 'react';

import OverlayDetail from './OverlayDetail';
import Boulder from '../../../models/Boulder';
import Crag from '../../../models/Crag';
import withBoulder from '../boulders/withBoulder';
import Truncate from '../Truncate';
import RoutesDifficultyBreakdown from '../charts/RoutesDifficultyBreakdown';

type NeededProps = 'id' | 'name' | 'description' | 'routes';
interface Props {
  crag: Crag;
  boulder: Pick<Boulder, NeededProps>;
}

const BoulderOverlayContent: React.FunctionComponent<Props> = (props) => {
  return (
    <React.Fragment>
      <p>
        <Truncate length={40} text={props.boulder.description} />
      </p>
      <RoutesDifficultyBreakdown
        routes={props.boulder.routes}
        height="135px"
      />
    </React.Fragment>
  );
};

const BoulderOverlay: React.FunctionComponent<Props> = (props) => {
  console.warn({ props }, 'BoulderOverlay');
  return (
    <OverlayDetail
      header={props.boulder.name}
      linkTo={`/boulders/${props.boulder.id}`}
      content={<BoulderOverlayContent {...props} />}
    />
  );
};

BoulderOverlay.defaultProps = {
  boulder: {
    id: 1,
    name: 'Sample Boulder',
    description: 'An boulder of some sort',
    routes: []
  }
};

const ConnectedBoulderOverlay = withBoulder(BoulderOverlay);
export { ConnectedBoulderOverlay };
export default BoulderOverlay;
