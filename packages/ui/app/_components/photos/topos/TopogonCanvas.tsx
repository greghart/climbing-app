import LabelComponent from "@/app/_components/photos/topos/LabelCanvas";
import LineComponent from "@/app/_components/photos/topos/LineCanvas";
import {
  useTopoEditorStore,
  useTopogonEditorStore,
} from "@/app/_components/photos/topos/TopoEditorStoreProvider";
import { Label, Line, Topogon as TopogonModel } from "@/app/_models";
import Konva from "konva";
import { observer } from "mobx-react-lite";
import React from "react";
import { Circle, Group, Transformer } from "react-konva";

interface Props {
  topogon: TopogonModel;
}

/**
 * TopogonCanvas renders the lines and labels of a Topogon
 * * Mostly used for read only mode, but does need to be the owner of the transformer
 *   * TODO: We could refactor this, but right now it's easier to only show Topogon in one place
 */
function TopogonCanvas(props: Props) {
  const rootStore = useTopoEditorStore();
  if (!props.topogon?.data) return false;

  return (
    <>
      {props.topogon.data.lines.map((line, i) => (
        <TopogonLine key={i} idx={i} line={line} />
      ))}
      {props.topogon.data.labels.map((label, i) => (
        <TopogonLabel
          key={i}
          idx={i}
          defaultText={rootStore.selectedEntityText(props.topogon) || ""}
          label={label}
        />
      ))}
    </>
  );
}

function TopogonLabel_({
  label,
  idx,
  defaultText,
}: {
  label: Label;
  idx: number;
  defaultText: string;
}) {
  const store = useTopogonEditorStore();
  const selected = store?.selectedLabelIndex === idx;
  // Transformable
  const { groupRef, trRef } = useTransformer(
    selected,
    label.point.x,
    label.point.y
  );

  return (
    <>
      <Group
        ref={groupRef}
        draggable={selected}
        onClick={(e) => {
          if (store && !selected) {
            store.setSelectedLabel(idx);
            e.cancelBubble = true;
          }
        }}
        onDragEnd={(e: any) => {
          const x = e.target.x();
          const y = e.target.y();
          label.move(x, y);
        }}
      >
        <LabelComponent
          LabelProps={{ ...label.point }}
          TextProps={{
            text: label.text === "" ? defaultText : label.text,
            fill: label.color,
          }}
          TagProps={{ fill: label.fill }}
        />
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

function TopogonLine_({ line, idx }: { line: Line; idx: number }) {
  const store = useTopogonEditorStore();
  // Don't "select" with just a point, bad UX
  const selected = store?.selectedLineIndex === idx && line.points.length > 1;
  // Transformable
  const { groupRef, trRef } = useTransformer(selected, line.konvaPoints);

  return (
    <>
      <Group
        ref={groupRef}
        draggable={selected}
        onClick={(e) => {
          if (store && !selected) {
            store.setSelectedLine(idx);
            e.cancelBubble = true;
          }
        }}
        onDragEnd={(e: any) => {
          const x = e.target.x();
          const y = e.target.y();
          line.movePoints({ x, y });
        }}
      >
        <LineComponent
          x={0}
          y={0}
          points={line.konvaPoints}
          strokeWidth={4}
          hitStrokeWidth={10}
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
const TopogonLine = observer(TopogonLine_);
const TopogonLabel = observer(TopogonLabel_);

function useTransformer(selected: boolean, ...updaters: any[]) {
  const groupRef = React.useRef<Konva.Group>(null);
  const trRef = React.useRef<Konva.Transformer>(null);
  React.useEffect(() => {
    if (selected) {
      // we need to attach transformer manually
      trRef.current!.nodes([groupRef.current!]);
      trRef.current!.getLayer()!.batchDraw();
    }
  }, [selected]);
  // If line updates, we need to update group and tr manually (former we control, latter is in konva state)
  React.useEffect(() => {
    console.warn("Resetting group and tr");
    groupRef.current?.position({ x: 0, y: 0 });
    trRef.current?.forceUpdate();
  }, updaters);
  return { groupRef, trRef };
}

export default observer(TopogonCanvas);
