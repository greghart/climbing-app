import * as React from "react";
import { divIcon } from "leaflet";
import { Marker } from "react-leaflet";

const boulderIcon = '<img class="my-icon" src="/boulder_icon.svg.png"/>';
const icon = divIcon({
  className: "null",
  html: boulderIcon,
});

const BoulderIcon = (props: React.ComponentProps<typeof Marker>) => {
  return <Marker {...props} icon={icon} />;
};

export default BoulderIcon;
