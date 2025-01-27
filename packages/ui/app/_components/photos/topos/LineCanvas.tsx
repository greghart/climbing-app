import Konva from "konva";
import React from "react";
import { Line as KonvaLine } from "react-konva";

// Base options for Line
const LineCanvas = React.forwardRef<
  Konva.Line,
  React.ComponentProps<typeof KonvaLine>
>((props, ref) => {
  return (
    <KonvaLine
      ref={ref}
      tension={0.2}
      stroke="green"
      strokeWidth={4}
      lineJoin="round"
      dash={[33, 10]}
      {...props}
    />
  );
});

export default LineCanvas;
