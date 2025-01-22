import React from "react";
import { Line as KonvaLine } from "react-konva";

const Line = (props: React.ComponentProps<typeof KonvaLine>) => {
  return (
    <KonvaLine
      tension={0.2}
      stroke="green"
      strokeWidth={4}
      lineJoin="round"
      dash={[33, 10]}
      {...props}
    />
  );
};

export default Line;
