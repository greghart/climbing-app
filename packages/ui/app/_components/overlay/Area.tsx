"use client";
import RoutesDifficultyBreakdown from "@/app/_components/charts/RoutesDifficultyBreakdown";
import Truncate from "../Truncate";
import { IArea, IRoute } from "models";
import { reduce } from "lodash-es";
import BouldersList from "@/app/_components/overlay/BouldersList";
import { Stack, Typography } from "@mui/material";

type NeededProps = "id" | "name" | "description" | "boulders";
interface Props {
  area: Pick<IArea, NeededProps>;
}

export default function Area(props: Props) {
  return (
    <Stack spacing={1} alignItems="center">
      <Typography variant="body1" key="description">
        <Truncate
          length={80}
          text={props.area.description || "Beautiful boulders"}
        />
      </Typography>
      <RoutesDifficultyBreakdown
        key="chart"
        routes={reduce(
          props.area.boulders,
          (memo, thisBoulder) => {
            return memo.concat(thisBoulder.routes || []);
          },
          [] as IRoute[]
        )}
        height="135px"
      />
      <BouldersList boulders={props.area.boulders} key="boulders-list" />
    </Stack>
  );
}
