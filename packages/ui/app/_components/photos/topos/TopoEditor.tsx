"use client";
import TopoCanvas from "@/app/_components/photos/topos/TopoCanvas";
import { Grid } from "@mui/material";
import { IPhoto, ITopo } from "models";

interface Props {
  photo: IPhoto;
  topo?: ITopo;
}
export default function TopoEditor(props: Props) {
  return (
    // Break out of parent
    <div style={{ margin: "1em calc(50% - 45vw)" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <TopoCanvas {...props} />
        </Grid>
        <Grid item xs={12} lg={4}>
          TOOLS All just pen tool for now
        </Grid>
      </Grid>
    </div>
  );
}
