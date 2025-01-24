import Line from "@/app/_components/photos/topos/Line";
import { useTopogonEditorStore } from "@/app/_components/photos/topos/TopoEditorStoreProvider";
import { pointsToLine } from "@/app/_components/photos/topos/util";
import { observer } from "mobx-react-lite";
import { ITopogon } from "models";
import React from "react";
import { Circle } from "react-konva";

interface Props {
  topogon: ITopogon;
}

function Topogon(props: Props) {
  const store = useTopogonEditorStore();
  if (!props.topogon?.data) return false;

  return props.topogon.data.lines.map((line, i) => (
    <React.Fragment key={i}>
      <Line
        points={pointsToLine(...line.points)}
        onClick={() => store && !store.selectedLine && store.setSelectedLine(i)}
        strokeWidth={store?.selectedLineIndex === i ? 6 : 4}
        stroke={line.color}
        tension={line.tension}
      />
      {line.points.map((p) => (
        <Circle
          key={`${p.x},${p.y}`}
          color={line.color}
          fill={line.color}
          fillOpacity={0.5}
          radius={store?.selectedLineIndex === i ? 7 : 5}
          x={p.x}
          y={p.y}
        />
      ))}
    </React.Fragment>
  ));
}

export default observer(Topogon);
