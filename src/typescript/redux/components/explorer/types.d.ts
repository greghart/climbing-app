import { LatLngTuple } from 'leaflet';

export interface Route {
  id: string;
  name: string;
  difficulty: string;
}

export interface Boulder {
  id: string;
  name: string;
  routes: Route[];
  coordinates: LatLngTuple;
}

export interface Area {
  id: string;
  name: string;
  coordinates: LatLngTuple[];
  boulders?: Boulder[];
}

export interface Crag {
  name: string;
  areas: Area[];
  center: LatLngTuple;
  zoom: number;
  minZoom: number;
  maxZoom: number;
}