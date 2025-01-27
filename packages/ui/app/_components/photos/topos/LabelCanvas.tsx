import Konva from "konva";
import React from "react";
import * as ReactKonva from "react-konva";

interface Props {
  LabelProps: React.ComponentProps<typeof ReactKonva.Label>;
  TagProps: React.ComponentProps<typeof ReactKonva.Tag>;
  TextProps: React.ComponentProps<typeof ReactKonva.Text>;
}

// Base options for Label
const LabelCanvas = React.forwardRef<Konva.Label, Props>((props, ref) => {
  return (
    <ReactKonva.Label {...props.LabelProps}>
      <ReactKonva.Tag
        align="center"
        pointerWidth={10}
        pointerHeight={10}
        cornerRadius={8}
        {...props.TagProps}
      />
      <ReactKonva.Text
        fontSize={18}
        fontFamily="Calibri"
        fill="#555"
        padding={8}
        align="center"
        {...props.TextProps}
      />
    </ReactKonva.Label>
  );
});

export default LabelCanvas;
