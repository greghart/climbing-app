import type {
  IArea,
  IBoulder,
  IBounds,
  IComment,
  ICommentable,
  ICoordinateLiteral,
  ICrag,
  ILine,
  IParking,
  IPhotoable,
  IPolygon,
  ITrail,
} from "models";
import type { Area } from "./area_pb";
import type { Boulder } from "./boulder_pb";
import type { Bounds } from "./bounds_pb";
import type { Comment } from "./comment_pb";
import type { Commentable } from "./commentable_pb";
import type { Coordinate } from "./coordinate_pb";
import type { Crag } from "./crag_pb";
import type { Line } from "./line_pb";
import type { Parking } from "./parking_pb";
import type { Photoable } from "./photoable_pb";
import type { Polygon } from "./polygon_pb";
import type { Trail } from "./trail_pb";

// --- ADAPTERS ---

// Coordinate
export function ProtoToCoordinate(proto?: Coordinate): ICoordinateLiteral {
  return {
    lat: proto?.lat ?? 0,
    lng: proto?.lng ?? 0,
  };
}

// Bounds
export function ProtoToBounds(proto?: Bounds): IBounds | undefined {
  if (!proto) return undefined;
  return {
    topLeft: ProtoToCoordinate(proto.topLeft),
    bottomRight: ProtoToCoordinate(proto.bottomRight),
  };
}

// Polygon
export function ProtoToPolygon(proto: Polygon): IPolygon {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    descriptor: proto.descriptor,
    coordinates: proto.coordinates?.map(ProtoToCoordinate),
  };
}

// Line
export function ProtoToLine(proto: Line): ILine {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    start: ProtoToCoordinate(proto.start),
    end: ProtoToCoordinate(proto.end),
  };
}

// Comment (proto only has id field)
export function ProtoToComment(proto: Comment): IComment {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    text: "", // Not available in proto
    commentable: { id: undefined, descriptor: "", comments: [] },
    createdAt: new Date(0),
    updatedAt: new Date(0),
  };
}

// Commentable
export function ProtoToCommentable(proto: Commentable): ICommentable {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    descriptor: proto.descriptor,
    comments: proto.comments?.map(ProtoToComment),
  };
}

// Photoable
export function ProtoToPhotoable(proto: Photoable): IPhotoable {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    descriptor: proto.descriptor,
    // photos: proto.photos?.map(ProtoToPhoto), // Add if available
  };
}

// Area
export function ProtoToArea(proto: Area): IArea {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    name: proto.name,
    description: proto.description,
    polygon: proto.polygon ? ProtoToPolygon(proto.polygon) : undefined,
    boulders: proto.boulders?.map((b: Boulder) => ProtoToBoulder(b)),
    commentable: proto.commentable
      ? ProtoToCommentable(proto.commentable)
      : undefined,
    photoable: proto.photoable ? ProtoToPhotoable(proto.photoable) : undefined,
  };
}

// Boulder (minimal, only id field available in proto)
export function ProtoToBoulder(proto: Boulder): IBoulder {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    name: "", // Not available in proto
    coordinates: { lat: 0, lng: 0 }, // Not available in proto
  };
}

// Crag
export function ProtoToCrag(proto: Crag): ICrag {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    name: proto.name,
    description: proto.description,
    bounds: proto.bounds ? ProtoToBounds(proto.bounds) : undefined,
    center: ProtoToCoordinate(proto.center),
    defaultZoom: proto.defaultZoom,
    minZoom: proto.minZoom,
    maxZoom: proto.maxZoom,
    parking: proto.parking ? ProtoToParking(proto.parking) : undefined,
    areas: proto.areas?.map((a: Area) => ProtoToArea(a)),
    commentable: proto.commentable
      ? ProtoToCommentable(proto.commentable)
      : undefined,
    photoable: proto.photoable ? ProtoToPhotoable(proto.photoable) : undefined,
    trail: proto.trail ? ProtoToTrail(proto.trail) : undefined,
  };
}

// Trail
export function ProtoToTrail(proto: Trail): ITrail {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    lines: proto.lines?.map(ProtoToLine),
  };
}

export function ProtoToParking(proto: Parking): IParking {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    name: proto.name,
    description: proto.description,
    location: ProtoToCoordinate(proto.location),
    // If you add more fields to IParking, map them here
  };
}
