"use client";
import Truncate from "@/app/_components/Truncate";
import { Stack, Typography } from "@mui/material";
import { IRoute } from "models";

interface Props {
  route: IRoute;
}

export default function Route(props: Props) {
  return (
    <Stack spacing={1} alignItems="center">
      <Typography variant="body1" key="description">
        <Truncate
          length={80}
          text={props.route.description || "Beautiful route"}
        />
      </Typography>
    </Stack>
  );
}
