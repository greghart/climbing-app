"use client";
import RoutesDifficultyBreakdown from "@/app/_components/charts/RoutesDifficultyBreakdown";
import { reduce } from "lodash-es";
import { IArea, ICrag, IRoute } from "models";
import React from "react";
import Truncate from "../Truncate";

type NeededProps = "id" | "name" | "description" | "boulders";
interface Props {
  crag: ICrag;
  area: Pick<IArea, NeededProps>;
}

const Area = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <div ref={ref}>
      <p>
        <Truncate
          length={80}
          text={props.area.description || "Beautiful boulders"}
        />
      </p>
      <RoutesDifficultyBreakdown
        routes={reduce(
          props.area.boulders,
          (memo, thisBoulder) => {
            return memo.concat(thisBoulder.routes || []);
          },
          [] as IRoute[]
        )}
        height="135px"
      />
    </div>
  );
});

export default Area;
