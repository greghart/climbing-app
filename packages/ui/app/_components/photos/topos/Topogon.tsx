import Line from "@/app/_components/photos/topos/Line";
import { pointsToLine } from "@/app/_components/photos/topos/util";
import { ITopogon } from "models";
import React from "react";
import { Circle } from "react-konva";

interface Props {
  topogon: ITopogon;
}

export default function Topogon(props: Props) {
  if (!props.topogon.data) return false;

  return props.topogon.data.lines.map((line, i) => (
    <React.Fragment key={i}>
      <Line points={pointsToLine(...line.points)} />
      {line.points.map((p) => (
        <Circle
          key={`${p.x},${p.y}`}
          color="green"
          fill="green"
          fillOpacity={0.5}
          radius={5}
          x={p.x}
          y={p.y}
        />
      ))}
    </React.Fragment>
  ));
}
