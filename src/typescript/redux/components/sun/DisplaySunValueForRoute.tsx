import * as React from 'react';
import Route from '../../../models/Route';
import getNormalizedSunValue from './getNormalizedSunValue';
import DisplaySunValue from './DisplaySunValue';
import { formValueSelector } from 'redux-form';
import { State } from '../../reducer';
import { connect } from 'react-redux';

interface Props {
  route: Route;
  hour?: number;
}

const DisplaySunValueForRoute: React.FunctionComponent<Props> = (props) => {
  const check = props.route.coordinate && props.route.boulder.coordinate;
  if (!check) {
    return <span>Unknown sun value</span>;
  }
  const time = new Date();
  if (props.hour) {
    time.setHours(props.hour);
  }
  const sunValue = getNormalizedSunValue(
    [
      props.route.coordinate.lat - props.route.boulder.coordinate.lat,
      props.route.coordinate.lng - props.route.boulder.coordinate.lng,
    ],
    props.route.coordinate,
    time
  );
  return <DisplaySunValue sunValue={sunValue} />;

};

// Setup a component to connect to sun form
const selector = formValueSelector('sun-form');
const mapStateToProps = (state: State) => {
  return {
    hour: selector(state, 'givenHour') / 4,
  };
};
const ConnectedDisplaySunValueForRoute = connect(
  mapStateToProps,
)(DisplaySunValueForRoute);

export { ConnectedDisplaySunValueForRoute };
export default DisplaySunValueForRoute;
