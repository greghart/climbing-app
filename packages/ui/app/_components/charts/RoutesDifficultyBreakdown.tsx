"use client";
import { reduce } from "lodash-es";
import { Grade, IRoute, Route } from "models";
import * as React from "react";
import { Chart } from "react-google-charts";

type Props = Partial<React.ComponentProps<typeof Chart>> & {
  routes: IRoute[];
};

const buckets = {
  0: [-100, Grade.build("V3+").value],
  1: [Grade.build("V3+").value, Grade.build("V6+").value],
  2: [Grade.build("V6+").value, Grade.build("V10+").value],
  3: [Grade.build("V10+").value, 100000],
};
const RoutesDifficultyBreakdown: React.FunctionComponent<Props> = (props) => {
  const routesByBucket = reduce(
    props.routes.map((r) => Route.build(r)),
    (memo, thisRoute) => {
      if (!thisRoute.grade) return memo;

      for (const key in buckets) {
        const bucket = buckets[key as unknown as keyof typeof buckets];
        const min = bucket[0];
        const max = bucket[1];
        if (thisRoute.grade.value >= min && thisRoute.grade.value <= max) {
          memo[key as unknown as keyof typeof buckets] += 1;
          return memo;
        }
      }
      console.warn("Route", thisRoute, "did not fit in any bucket??");
      memo[3] += 1;
      return memo;
    },
    { 0: 0, 1: 0, 2: 0, 3: 0 }
  );
  return (
    <Chart
      width={"100%"}
      height={"150px"}
      chartType="ColumnChart"
      loader={<div>Loading Chart</div>}
      data={[
        ["Difficulty", "Count"],
        ["V0-3", routesByBucket[0]],
        ["V4-6", routesByBucket[1]],
        ["V7-10", routesByBucket[2]],
        ["V11+", routesByBucket[3]],
      ]}
      options={{
        chartArea: { width: "50%" },
        hAxis: {
          title: "Grade Buckets",
        },
        vAxis: {
          title: "Count",
          minValue: 1,
        },
        legend: {
          position: "none",
        },
      }}
      {...props}
    />
  );
};

export default RoutesDifficultyBreakdown;
