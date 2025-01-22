"use client";
import LineTracer from "@/app/_components/photos/topos/LineTracer";
import { IPhoto, ITopo } from "models";
import React from "react";
import { Image, Stage } from "react-konva";
import useImage from "use-image";

interface Props {
  photo: IPhoto;
  topo?: ITopo;
}

export default function TopoCanvas(props: Props) {
  // Inherit height from parent div
  // Note we don't react to resizes, no bother for now
  const [height, setHeight] = React.useState<number>(800);
  const [width, setWidth] = React.useState<number>(600);
  const div = React.useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  // Our photo background
  const [img] = useImage(`/uploads/photos/${props.photo.upload!.key}`);
  if (!img) return false;

  return (
    <div style={{ width: "100%", height: "100%" }} ref={div}>
      <Stage width={width} height={height}>
        <LineTracer>
          <Image image={img} {...fitImage(img!, width, height)} />
        </LineTracer>
      </Stage>
    </div>
  );
}

function fitImage(img: HTMLImageElement, width: number, height: number) {
  const aspect = img.width / img.height;
  const aspectCanvas = width / height;
  // Scale it down to fit
  const scale = aspectCanvas > aspect ? height / img.height : width / img.width;
  console.warn("fitImage", { aspect, aspectCanvas, scale });
  return { width: img.width * scale, height: img.height * scale };
}
