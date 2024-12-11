"use client";
import Truncate from "@/app/_components/Truncate";
import AreasList from "@/app/_components/explorer/overlay/AreasList";
import { Stack, Typography } from "@mui/material";
import { ICrag } from "models";

type NeededProps = "id" | "name" | "description" | "areas";
interface Props {
  crag: Pick<ICrag, NeededProps>;
}

export default function Crag(props: Props) {
  return (
    <Stack spacing={1} alignItems="center">
      <Typography variant="body1" key="description">
        <Truncate
          length={80}
          text={props.crag.description || "Beautiful areas"}
        />
      </Typography>
      <Typography variant="subtitle1">Areas</Typography>
      <AreasList areas={props.crag.areas} key="areas-list" />
    </Stack>
  );
}
