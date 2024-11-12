import { type LeafletMouseEvent } from "leaflet";

/**
 * Simple helper to capture clicks and keep them from bubbling up.
 * Note we use the event bubble hierarchy to do things like:
 * * Clicking outside anything clickable should reset map to crag
 */
export default function blockClicks(e: LeafletMouseEvent) {
  e.originalEvent.preventDefault();
  e.originalEvent.stopPropagation();
  return false;
}
