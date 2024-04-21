"use client";
import Truncate from "@/app/_components/Truncate";
import RoutesDifficultyBreakdown from "@/app/_components/charts/RoutesDifficultyBreakdown";
import BouldersList from "@/app/_components/explorer/overlay/BouldersList";
import { Stack, Typography } from "@mui/material";
import { reduce } from "lodash-es";
import { IBoulder, IRoute } from "models";

interface Props {
  boulder: IBoulder;
}

export default function Boulder(props: Props) {
  return (
    <Stack spacing={1} alignItems="center">
      <Typography variant="body1" key="description">
        <Truncate
          length={80}
          text={props.boulder.description || "Beautiful boulder"}
        />
      </Typography>
      <RoutesDifficultyBreakdown
        key="chart"
        routes={props.boulder.routes || []}
        height="135px"
      />
      {/* <RoutesList routes={props.area.routes} key="routes-list" /> */}
    </Stack>
  );
}
