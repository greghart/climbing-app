import { Polygon, type PolygonProps } from "react-leaflet";

import { omit, pick } from "lodash-es";

/**
 * A nice looking polygon for displaying
 *
 * Transparent so it can be seen alongside other components
 */
type Style = Pick<
  PolygonProps,
  "weight" | "opacity" | "color" | "dashArray" | "fillOpacity" | "fillColor"
>;
type Props = PolygonProps & {
  normalStyle?: Style;
  overStyle?: Style;
  // Whether to show the polygon
  // It can be useful to use a polygon for tooltip positioning,
  // but we dont' want to show it
  show?: boolean;
};

const normalStyle = {
  weight: 1.0,
  opacity: 1,
  color: "white",
  dashArray: "3",
  fillOpacity: 0.2,
  fillColor: "#088da5",
};

const overStyle = {
  weight: 5,
  color: "#666",
  dashArray: "",
  fillOpacity: 0.2,
};

export default function MyPolygon({ show = true, ...props }: Props) {
  // Direct styles should override objects
  const directStyles = pick(
    props,
    "weight",
    "opacity",
    "color",
    "dashArray",
    "fillOpacity",
    "fillColor"
  );
  const myNormalStyle = omit(normalStyle, Object.keys(directStyles));
  const myOverStyle = omit(overStyle, Object.keys(directStyles));
  let polygonRef: any;
  if (!show) {
    directStyles.opacity = 0;
    directStyles.fillOpacity = 0;
  }
  return (
    <Polygon
      {...normalStyle}
      {...props}
      {...directStyles}
      ref={(polygon) => {
        polygonRef = polygon;
        if (polygonRef) {
          polygonRef.setStyle(directStyles);
        }
      }}
      eventHandlers={{
        mouseover: () => show && polygonRef.setStyle(myOverStyle),
        mouseout: () => show && polygonRef.setStyle(myNormalStyle),
        ...props.eventHandlers,
      }}
    >
      {props.children}
    </Polygon>
  );
}
