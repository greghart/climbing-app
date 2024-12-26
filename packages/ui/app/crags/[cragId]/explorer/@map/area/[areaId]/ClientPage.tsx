"use client";
import AreaLayers from "@/app/_components/map/AreaLayers";
import Layers from "@/app/_components/map/Layers";
import usePolygonFit from "@/app/_components/map/usePolygonFit";
import { IArea, ITrail } from "models";

interface Props {
  area: IArea;
  trail?: ITrail;
}

export default function ClientPage(props: Props) {
  usePolygonFit(props.area.polygon);
  return (
    <Layers>
      {(Overlay, LayerGroup) => (
        <AreaLayers
          area={props.area}
          trail={props.trail}
          Overlay={Overlay}
          LayerGroup={LayerGroup}
        />
      )}
    </Layers>
  );
}
