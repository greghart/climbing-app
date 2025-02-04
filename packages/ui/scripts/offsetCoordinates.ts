import {
  BoulderSchema,
  CragSchema,
  getDataSource,
  PolygonCoordinateSchema,
  RouteSchema,
  TrailLineSchema,
} from "@/db";

export default async function offsetCoordinates(lat: number, lng: number) {
  // Offset all coordinates by some amount
  const ds = await getDataSource();
  await ds.transaction(async (tx) => {
    // Boulder
    const res = await tx
      .createQueryBuilder()
      .update(BoulderSchema)
      .set({
        coordinates: {
          lat: () => `lat + ${lat}`,
          lng: () => `lng + ${lng}`,
        },
      })
      .execute();
    console.warn("Result:", res);
    // Crag
    await tx
      .createQueryBuilder()
      .update(CragSchema)
      .set({
        center: {
          lat: () => `center_Lat + ${lat}`,
          lng: () => `center_Lng + ${lng}`,
        },
        bounds: {
          topLeft: {
            lat: () =>
              `iif(bounds_topLeft_Lat is null, null, bounds_topLeft_Lat  + ${lat})`,
            lng: () =>
              `iif(bounds_topLeft_Lng is null, null, bounds_topLeft_Lng + ${lng})`,
          },
          bottomRight: {
            lat: () =>
              `iif(bounds_bottomRight_Lat is null, null, bounds_bottomRight_Lat + ${lat})`,
            lng: () =>
              `iif(bounds_bottomRight_Lng is null, null, bounds_bottomRight_Lng + ${lng})`,
          },
        },
      })
      .execute();
    // Trail lines
    await tx
      .createQueryBuilder()
      .update(TrailLineSchema)
      .set({
        start: {
          lat: () => `startLat + ${lat}`,
          lng: () => `startLng + ${lng}`,
        },
        end: {
          lat: () => `endLat + ${lat}`,
          lng: () => `endLng + ${lng}`,
        },
      })
      .execute();
    // Routes
    await tx
      .createQueryBuilder()
      .update(RouteSchema)
      .set({
        coordinates: {
          lat: () => `iif(lat is null, null, lat + ${lat})`,
          lng: () => `iif(lng is null, null, lng + ${lng})`,
        },
      })
      .execute();
    // Polygons
    await tx
      .createQueryBuilder()
      .update(PolygonCoordinateSchema)
      .set({
        lat: () => `lat + ${lat}`,
        lng: () => `lng + ${lng}`,
      })
      .execute();
  });
  process.exit(0);
}

offsetCoordinates(-0.000005, -0.000005);
