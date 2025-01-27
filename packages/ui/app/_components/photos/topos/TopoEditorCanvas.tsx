"use client";
import LineTracer from "@/app/_components/photos/topos/LineTracer";
import { useTopoEditorStore } from "@/app/_components/photos/topos/TopoEditorStoreProvider";
import Topogon from "@/app/_components/photos/topos/Topogon";
import { Group, Layer } from "react-konva";

interface Props {
  img: React.ReactNode;
}

export default function TopoEditorCanvas(props: Props) {
  const store = useTopoEditorStore();

  // Show all topogons if user hasn't selected any
  if (!store.selectedTopogon) {
    return (
      <Layer>
        {props.img}
        {store.topogons.map((topogon) => (
          <Group
            key={topogon.id}
            onMouseOver={(e) => store.setHoveredTopogonId(topogon.id)}
            onMouseOut={(e) => store.setHoveredTopogonId(undefined)}
            onClick={(e) => store.setSelectedTopogonId(topogon.id)}
          >
            <Topogon key={topogon.id} topogon={topogon} />
          </Group>
        ))}
      </Layer>
    );
  }

  const topogonStore = store.topogonEditor!;

  // Tool amends canvas in some way
  let tool: React.ReactNode;
  switch (topogonStore.tool) {
    case "line":
      tool = <LineTracer>{props.img}</LineTracer>;
      break;
    case "text":
      // TODO: Add a label maker
      tool = <LineTracer>{props.img}</LineTracer>;
      break;
    default:
      tool = (
        <Layer
          onClick={(e) => topogonStore.setSelectedComponent("line", undefined)}
        >
          {props.img}
        </Layer>
      );
      break;
  }
  return (
    <>
      {tool}
      {/** Always show base topogon, since that's what's being edited */}
      <Layer>
        <Topogon topogon={store.selectedTopogon} />
      </Layer>
    </>
  );
}
