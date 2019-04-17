import * as React from 'react';
import reduce from 'lodash/reduce';

import OverlayDetail from './OverlayDetail';
import Area from '../../../models/Area';
import Crag from '../../../models/Crag';
import withArea from '../areas/withArea';
import Truncate from '../Truncate';
import RoutesDifficultyBreakdown from '../charts/RoutesDifficultyBreakdown';

type NeededProps = 'id' | 'name' | 'description' | 'boulders';
interface Props {
  crag: Crag;
  area: Pick<Area, NeededProps>;
}

const AreaOverlayContent: React.FunctionComponent<Props> = (props) => {
  return (
    <React.Fragment>
      <p>
        <Truncate length={80} text={props.area.description} />
      </p>
      <RoutesDifficultyBreakdown
        routes={
          reduce(
            props.area.boulders,
            (memo, thisBoulder) => {
              return memo.concat(thisBoulder.routes || []);
            },
            []
          )
        }
        height="135px"
      />
    </React.Fragment>
  );
};

const AreaOverlay: React.FunctionComponent<Props> = (props) => {
  console.warn({ props }, 'AreaOverlay');
  return (
    <OverlayDetail
      header={props.area.name}
      linkTo={`/areas/${props.area.id}`}
      content={<AreaOverlayContent {...props} />}
    />
  );
};

AreaOverlay.defaultProps = {
  area: {
    id: 1,
    name: 'Sample Area',
    description: 'An area of some sort',
    boulders: []
  }
};

const ConnectedAreaOverlay = withArea(AreaOverlay);
export { ConnectedAreaOverlay };
export default AreaOverlay;
