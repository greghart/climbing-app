import * as React from 'react';
import OverlayDetail from './OverlayDetail';
import Area from '../../../models/Area';
import Crag from '../../../models/Crag';
import withArea from '../areas/withArea';
import Truncate from '../Truncate';

type NeededProps = 'id' | 'name' | 'description';
interface Props {
  crag: Crag;
  area: Pick<Area, NeededProps>;
}

const AreaOverlayContent: React.FunctionComponent<Props> = (props) => {
  return (
    <React.Fragment>
      <p>
        <Truncate length={140} text={props.area.description} />
      </p>
      TODO: Boulders breakdown of some sort?
      TODO: Routes breakdown of some sort?
    </React.Fragment>
  );
};

const AreaOverlay: React.FunctionComponent<Props> = (props) => {
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
  }
};

const Connected = withArea(AreaOverlay);
export { Connected };
export default AreaOverlay;
