import TopogonEditorStore from "@/app/_components/photos/topos/TopogonEditorStore";
import Konva from "konva";
import { observer } from "mobx-react-lite";
import React from "react";
import { Layer } from "react-konva";

interface Props {
  children?: React.ReactNode;
  store: TopogonEditorStore;
}

/**
 * LabelCanvasEditor handles selected label editing
 * * Since Topogon handles dragging, we just handle add and delete
 */
function LabelCanvasEditor(props: Props) {
  const store = props.store;
  console.warn("LabelCanvasEditor");

  const handleKeyPress = React.useCallback(
    (e: KeyboardEvent) => {
      if (!store.selectedLabel) return;

      if (e.key === "x") {
        store.removeSelectedLabel();
      }
    },
    [store.selectedLabel]
  );

  // Click to add labels
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.ctrlKey) return;

    if (!store.selectedLabel) {
      store.addLabel(e.target.getStage()!.getPointerPosition()!);
      e.cancelBubble = true;
    } else {
      // Deselect label if clicked outside
      store.resetSelectedComponent();
    }
  };

  // Get konva container for keypresses
  const layerRef = React.useRef<Konva.Layer>(null);
  React.useEffect(() => {
    if (!layerRef.current) return;
    const container = layerRef.current.getStage().container();
    container.tabIndex = 1;
    container.focus();
    container.addEventListener("keypress", handleKeyPress);
    return () => container.removeEventListener("keypress", handleKeyPress);
  }, [layerRef.current, handleKeyPress]);

  return (
    <Layer onMouseDown={handleClick} ref={layerRef}>
      {props.children}
    </Layer>
  );
}

export default observer(LabelCanvasEditor);
