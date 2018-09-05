import * as React from 'react';
import SFC = React.SFC;
import { RouteConfigComponentProps } from "react-router-config";

import RouteLayout from '../components/routes/RouteLayout';

interface RouteParams {
}

const RouteRoute: SFC<RouteConfigComponentProps<RouteParams>> = (props) => {
  return (
    <RouteLayout />
  );
};

export default RouteRoute;


