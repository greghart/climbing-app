import { Crag, getDataSource } from "@/db";
import { reduce } from "lodash-es";
import { ICrag } from "models";
import { cache } from "react";
import "server-only";

export interface SearchParams {
  cragId: number;
  query?: string;
}

interface Searchable {
  name: string;
  id?: number;
}
type SearchResultType = "area" | "boulder" | "route";
export type SearchResult = Searchable & {
  type: SearchResultType;
  parent?: SearchResult;
};

const search = cache(async (params: SearchParams) => {
  const ds = await getDataSource();

  // For simplicity, just get all routes in the crag and filter them in memory
  // TODO: Migrate to database as perf requires
  const crag = await ds.getRepository(Crag).findOne({
    where: { id: params.cragId },
    relations: ["areas", "areas.boulders", "areas.boulders.routes"],
    select: {
      id: true,
      name: true,
      areas: {
        id: true,
        name: true,
        boulders: {
          id: true,
          name: true,
          routes: {
            id: true,
            name: true,
          },
        },
      },
    },
  });
  if (!crag) return [];

  const filterSearch = searchMatcher(params.query);
  return getSearchableEntitiesForCrag(crag).filter((thisEntity) => {
    return (
      // filterType(thisEntity) &&
      filterSearch(thisEntity)
      // filterSun(thisEntity)
    );
  });
});

export default search;

// Helper functions

const withType =
  (type: SearchResultType) =>
  (parent?: SearchResult) =>
  (input: Searchable): SearchResult => {
    return {
      ...input,
      parent,
      type: type,
    };
  };
const mapAreaResult = withType("area")(undefined);
const mapBoulderResult = withType("boulder");
const mapRoute = withType("route");

function getSearchableEntitiesForCrag(crag: ICrag) {
  // Add areas
  return reduce(
    crag.areas,
    (memo, area) => {
      const areaResult = mapAreaResult(area);
      const mapBoulderForArea = mapBoulderResult(areaResult);
      memo.push(areaResult);
      // Add boulders
      area.boulders?.forEach((boulder) => {
        const boulderResult = mapBoulderForArea(boulder);
        const mapRouteForBoulder = mapRoute(boulderResult);
        memo.push(boulderResult);
        // Add routes
        boulder.routes?.forEach((route) => {
          memo.push(mapRouteForBoulder(route));
        });
      });

      return memo;
    },
    [] as Array<SearchResult>
  );
}

type GetMatcher = (...args: any[]) => (s: Searchable) => boolean;
// TODO: Fuse.js or similar
const searchMatcher: GetMatcher = (search = "") => {
  const _search = search.toLowerCase().trim();
  return (s: Searchable) => {
    return s.name.toLowerCase().trim().indexOf(_search) !== -1;
  };
};
// const typeMatcher: GetMatcher = (type: Tag | "any") => {
//   if (!type || type === "any") {
//     return (s) => true;
//   }
//   return (s) => {
//     return s._type === type;
//   };
// };
// const sunMatcher: GetMatcher = (apply: boolean = false, givenHour: number) => {
//   if (!apply) {
//     return (s) => true;
//   }
//   const time = new Date();
//   if (givenHour) {
//     time.setHours(givenHour);
//   }
//   return (s) => {
//     if (!isRoute(s)) {
//       return false;
//     }
//     const sunValue = getNormalizedSunValueForRoute(s, time);
//     // Totally arbitrary :o
//     return sunValue < 0.6 && sunValue > 0;
//   };
// };
