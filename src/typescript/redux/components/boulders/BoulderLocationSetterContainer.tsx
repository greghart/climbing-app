import * as React from 'react';
import * as Leaflet from 'leaflet';
import BoulderLocationSetter from './BoulderLocationSetter';
import Coordinate from '../../../models/Coordinate';
import { ExtractProps } from '../../../externals';

interface ContainerProps {
  defaultCurrent?: Coordinate;
}
interface ContainerState {
  actualCurrent?: Coordinate;
}

class BoulderLocationSetterContainer extends React.Component<ContainerProps & ExtractProps<typeof BoulderLocationSetter>, ContainerState> {

  constructor(props) {
    super(props);
    this.state = {
      actualCurrent: props.defaultCurrent
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(e: Leaflet.LeafletMouseEvent) {
    const c = new Coordinate(e.latlng.lat, e.latlng.lng);
    this.setState({
      actualCurrent: c
    });
  }

  render() {
    return (
      <BoulderLocationSetter
        {...this.props}
        current={this.state.actualCurrent}
        onClick={this.onClick}
      />
    );
  }

}

export default BoulderLocationSetterContainer;
