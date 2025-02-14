"use server";
import parkingSchema from "@/app/api/_schemas/parking";
import formAction from "@/app/api/formAction";
import { getDataSource, ParkingSchema } from "@/db";
import { IParking } from "models";
import "server-only";
import { z } from "zod";

type Model = Pick<IParking, "id" | "name" | "description" | "location">;
export type Meta = { cragId?: number };
const putParking = formAction<Model, z.infer<typeof parkingSchema>, Meta>(
  parkingSchema,
  async (res, data, prevState) => {
    if (res.meta.cragId === undefined) {
      return res.withErr("No cragId provided");
    }
    const ds = await getDataSource();
    return await ds.transaction(async (tx) => {
      // Existing already
      let parking = await tx.getRepository(ParkingSchema).findOne({
        where: res.meta,
      });

      const newParking = {
        ...parking,
        ...res.meta,
        ...data,
      };
      const saved = await tx.getRepository(ParkingSchema).save(newParking);

      return res.respond(saved, "Parking saved");
    });
  }
);

export default putParking;
