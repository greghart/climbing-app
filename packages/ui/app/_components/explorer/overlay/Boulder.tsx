"use client";
import Truncate from "@/app/_components/Truncate";
import RoutesDifficultyBreakdown from "@/app/_components/charts/RoutesDifficultyBreakdown";
import RoutesList from "@/app/_components/explorer/overlay/RoutesList";
import useRouteTo from "@/app/_components/explorer/useRouteTo";
import { Stack, Typography } from "@mui/material";
import { IBoulder, IRoute } from "models";

interface Props {
  boulder: IBoulder;
}

export default function Boulder(props: Props) {
  const routeTo = useRouteTo({ includeSearchParams: true })("route");

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
      <RoutesList
        routes={props.boulder.routes}
        key="routes-list"
        onClick={(r: IRoute) => routeTo(r.id)}
      />
    </Stack>
  );
}
