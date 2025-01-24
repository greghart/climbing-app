import LineComponent from "@/app/_components/photos/topos/Line";
import { useTopogonEditorStore } from "@/app/_components/photos/topos/TopoEditorStoreProvider";
import { Line, Topogon as TopogonModel } from "@/app/_models";
import Konva from "konva";
import { observer } from "mobx-react-lite";
import React from "react";
import { Circle, Group, Transformer } from "react-konva";

interface Props {
  topogon: TopogonModel;
}

function Topogon(props: Props) {
  if (!props.topogon?.data) return false;

  return props.topogon.data.lines.map((line, i) => (
    <TopogonLine key={i} idx={i} line={line} />
  ));
}

function _TopogonLine({ line, idx }: { line: Line; idx: number }) {
  const store = useTopogonEditorStore();
  // Don't "select" with just a point, bad UX
  const selected = store?.selectedLineIndex === idx && line.points.length > 1;
  // Transformable
  const groupRef = React.useRef<Konva.Group>(null);
  const trRef = React.useRef<any>(null);
  React.useEffect(() => {
    if (selected) {
      // we need to attach transformer manually
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [groupRef, selected]);

  return (
    <>
      <Group
        ref={groupRef}
        draggable={selected}
        onClick={() => store && !selected && store.setSelectedLine(idx)}
        onDragEnd={(e: any) => {
          line.movePoints({ x: e.target.x(), y: e.target.y() });
          groupRef.current?.position({ x: 0, y: 0 });
          trRef.current.position({ x: 0, y: 0 });
        }}
      >
        <LineComponent
          points={line.konvaPoints}
          strokeWidth={4}
          stroke={line.color}
          tension={line.tension}
        />
        {line.points.map((p) => (
          <Circle
            key={`${p.x},${p.y}`}
            color={line.color}
            fill={line.color}
            fillOpacity={0.5}
            radius={5}
            x={p.x}
            y={p.y}
          />
        ))}
      </Group>
      {selected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          resizeEnabled={false}
          rotateEnabled={false}
        />
      )}
    </>
  );
}
const TopogonLine = observer(_TopogonLine);

export default observer(Topogon);
