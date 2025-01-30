"use client";
import LabelCanvasEditor from "@/app/_components/photos/topos/LabelCanvasEditor";
import LineTracer from "@/app/_components/photos/topos/LineTracer";
import { useTopoEditorStore } from "@/app/_components/photos/topos/TopoEditorStoreProvider";
import TopogonCanvas from "@/app/_components/photos/topos/TopogonCanvas";
import { observer } from "mobx-react-lite";
import { Group, Layer } from "react-konva";

interface Props {
  img: React.ReactNode;
}

function TopoEditorCanvas_(props: Props) {
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
            <TopogonCanvas key={topogon.id} topogon={topogon} />
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
      tool = <LineTracer store={topogonStore}>{props.img}</LineTracer>;
      break;
    case "label":
      // TODO: Add a label maker
      tool = (
        <LabelCanvasEditor store={topogonStore}>{props.img}</LabelCanvasEditor>
      );
      break;
    default:
      tool = (
        <Layer onClick={(e) => topogonStore.resetSelectedComponent()}>
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
        <TopogonCanvas topogon={store.selectedTopogon} />
      </Layer>
    </>
  );
}

export default observer(TopoEditorCanvas_);
