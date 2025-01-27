import Konva from "konva";
import React from "react";
import { Text as KonvaText } from "react-konva";

const Text = React.forwardRef<
  Konva.Text,
  React.ComponentProps<typeof KonvaText>
>((props, ref) => {
  return (
    <KonvaText
      ref={ref}
      fontSize={18}
      fontFamily="Calibri"
      fill="#555"
      padding={8}
      align="center"
      {...props}
    />
  );
});

export default Text;
