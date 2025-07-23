import { Grade, Grade_GradingSystem } from "@/app/_grpc/grade_pb";
import { Photo } from "@/app/_grpc/photo_pb";
import { Timestamps } from "@/app/_grpc/timestamps_pb";
import { timestampDate, type Timestamp } from "@bufbuild/protobuf/wkt";
import {
  GradingSystemType,
  IGrade,
  type IArea,
  type IBoulder,
  type IBounds,
  type IComment,
  type ICommentable,
  type ICoordinateLiteral,
  type ICrag,
  type ILine,
  type IParking,
  type IPhoto,
  type IPhotoable,
  type IPolygon,
  type IRoute,
  type ITrail,
  type IUpload,
} from "models";
import { ITimestamps } from "models/lib/Timestamps";
import type { Area } from "./area_pb";
import type { Boulder } from "./boulder_pb";
import type { Bounds } from "./bounds_pb";
import type { Comment } from "./comment_pb";
import type { Coordinate } from "./coordinate_pb";
import type { Crag } from "./crag_pb";
import type { Line } from "./line_pb";
import type { Parking } from "./parking_pb";
import type { Polygon } from "./polygon_pb";
import type { Route } from "./route_pb";
import type { Trail } from "./trail_pb";
import type { Upload } from "./upload_pb";

// --- ADAPTERS ---

// Timestamps
export function ProtoToTimestamps(proto?: Timestamps): ITimestamps {
  if (!proto) {
    return {
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };
  }

  return {
    createdAt: ProtoToDate(proto.createdAt),
    updatedAt: ProtoToDate(proto.updatedAt),
  };
}

export function ProtoToDate(proto?: Timestamp): Date {
  if (!proto) return new Date(0);

  return timestampDate(proto);
}

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
    text: proto.text,
    ...ProtoToTimestamps(proto.timestamps),
  };
}

// Upload
export function ProtoToUpload(proto?: Upload): IUpload | undefined {
  if (!proto) return undefined;
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    key: proto.key,
    directory: proto.directory,
    engine: proto.engine,
    originalName: proto.originalName,
    fileSize:
      typeof proto.fileSize === "bigint"
        ? Number(proto.fileSize)
        : proto.fileSize,
    sha1Hash: proto.sha1Hash,
    uploadedAt: ProtoToDate(proto.uploadedAt),
  };
}

// Photo
export function ProtoToPhoto(proto: Photo): IPhoto {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    title: proto.title,
    description: proto.description,
    upload: ProtoToUpload(proto.upload),
    ...ProtoToTimestamps(proto.timestamps),
  };
}

// Commentable
export function ProtoToCommentable(proto: Comment[]): ICommentable {
  return {
    id: 0,
    descriptor: "unknown",
    comments: proto?.map(ProtoToComment),
  };
}

// Photoable
export function ProtoToPhotoable(proto: Photo[]): IPhotoable {
  return {
    id: 0,
    descriptor: "unknown",
    photos: proto?.map(ProtoToPhoto),
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
    commentable: {
      id: undefined,
      descriptor: "",
      comments: proto.comments?.map(ProtoToComment),
    },
    photoable: {
      id: undefined,
      descriptor: "",
      photos: proto.photos?.map(ProtoToPhoto),
    },
    ...ProtoToTimestamps(proto.timestamps),
  };
}

// Boulder
export function ProtoToBoulder(proto: Boulder): IBoulder {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    name: proto.name,
    description: proto.description,
    coordinates: ProtoToCoordinate(proto.coordinates),
    area: undefined, // area is not directly available in proto
    routes: proto.routes?.map((r: any) => ProtoToRoute(r)),
    polygon: proto.polygon ? ProtoToPolygon(proto.polygon) : undefined,
    commentable: {
      id: undefined,
      descriptor: "",
      comments: proto.comments?.map(ProtoToComment),
    },
    photoable: {
      id: undefined,
      descriptor: "",
      photos: proto.photos?.map(ProtoToPhoto),
    },
    ...ProtoToTimestamps(proto.timestamps),
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
    commentable: {
      id: undefined,
      descriptor: "",
      comments: proto.comments?.map(ProtoToComment),
    },
    photoable: {
      id: undefined,
      descriptor: "",
      photos: proto.photos?.map(ProtoToPhoto),
    },
    trail: proto.trail ? ProtoToTrail(proto.trail) : undefined,
    ...ProtoToTimestamps(proto.timestamps),
  };
}

// Trail
export function ProtoToTrail(proto: Trail): ITrail {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    lines: proto.lines?.map(ProtoToLine),
  };
}

// Parking
export function ProtoToParking(proto: Parking): IParking {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    name: proto.name,
    description: proto.description,
    location: ProtoToCoordinate(proto.location),
  };
}

// Route
export function ProtoToRoute(proto: Route): IRoute {
  return {
    id: typeof proto.id === "bigint" ? Number(proto.id) : proto.id,
    name: proto.name,
    description: proto.description,
    grade: ProtoToGrade(proto.grade),
    gradeRaw: proto.grade?.raw || "?",
  };
}

export function ProtoToGrade(proto?: Grade): IGrade {
  if (!proto) {
    return {
      id: 0,
      system: GradingSystemType.V,
      raw: "?",
      value: 0,
    };
  }
  let system: GradingSystemType;
  switch (proto.system) {
    case Grade_GradingSystem.V_SCALE:
      system = GradingSystemType.V;
      break;
    case Grade_GradingSystem.YDS:
      system = GradingSystemType.YDS;
      break;
    default:
      system = GradingSystemType.V;
  }
  return {
    system: system,
    raw: proto.raw,
    value: proto.value,
  };
}
