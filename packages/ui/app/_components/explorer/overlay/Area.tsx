"use client";
import Truncate from "@/app/_components/Truncate";
import RoutesDifficultyBreakdown from "@/app/_components/charts/RoutesDifficultyBreakdown";
import BouldersList from "@/app/_components/explorer/overlay/BouldersList";
import { Stack, Typography } from "@mui/material";
import { reduce } from "lodash-es";
import { IArea, IRoute } from "models";

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
      <Typography variant="subtitle1">Boulders</Typography>
      <BouldersList boulders={props.area.boulders} key="boulders-list" />
    </Stack>
  );
}
