"use client";
import { LeafletEventHandlerFnMap } from "leaflet";
import { useMapEvents } from "react-leaflet";

type Props = LeafletEventHandlerFnMap;

/**
 * useMapEvents must be a descendant of <Map>, so if inline you can use this component
 */
function EventsHandler(props: Props) {
  useMapEvents(props);
  return null;
}

export default EventsHandler;
