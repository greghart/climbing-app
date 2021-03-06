import * as React from 'react';
import Chart from 'react-google-charts';
import { ReactGoogleChartProps } from 'react-google-charts/dist/types';
import reduce from 'lodash/reduce';

import Route from '../../../models/Route';

type Props = Partial<ReactGoogleChartProps> & {
  routes: Route[];
};

const buckets = {
  0: ['V0', 'V1', 'V2', 'V3'],
  1: ['V4', 'V5', 'V6'],
  2: ['V7', 'V8', 'V9', 'V10'],
  3: ['V11+']
};
const RoutesDifficultyBreakdown: React.FunctionComponent<Props> = (props) => {
  console.warn({ props }, 'RoutesDifficultyBreakdown');
  const routesByBucket = reduce(
    props.routes,
    (memo, thisRoute) => {
      Object.keys(buckets).forEach((thisBucket) => {
        if (buckets[thisBucket].indexOf(thisRoute.gradeRaw) > -1) {
          memo[thisBucket] += 1;
        }
      });
      return memo;
    },
    { 0: 0, 1: 0, 2: 0, 3: 0 }
  );
  return (
    <Chart
      width={'100%'}
      height={'150px'}
      chartType="ColumnChart"
      loader={<div>Loading Chart</div>}
      data={[
        ['Difficulty', 'Count'],
        ['V0-3', routesByBucket[0]],
        ['V4-6', routesByBucket[1]],
        ['V7-10', routesByBucket[2]],
        ['V11+', routesByBucket[3]],
      ]}
      options={{
        title: 'Difficulty Breakdown',
        chartArea: { width: '50%' },
        hAxis: {
          title: 'Grade Buckets',
        },
        vAxis: {
          title: 'Count',
          minValue: 1,
        },
        legend: {
          position: 'none'
        }
      }}
      {...props}
    />
  );
};

export default RoutesDifficultyBreakdown;
