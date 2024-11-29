import * as db from "@/db";
import adaptedRepository from "@/db/repos/adaptedRepository";
import { ICrag, isBounds } from "models";

const BaseRepo = db.dataSource.getRepository(db.CragSchema);

const CragRepository = adaptedRepository(
  BaseRepo,
  function (crag: db.Crag | null): ICrag | undefined {
    if (!crag) return undefined;

    // Bounds is embedded, so fields can be null, but model layer wants it all or nothing
    if (!isBounds(crag.bounds)) {
      delete crag.bounds;
    }
    return crag as ICrag;
  }
);

export default CragRepository;
