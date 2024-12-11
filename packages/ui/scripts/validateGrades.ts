import { getDataSource, RouteSchema } from "@/db";
import { Grade } from "models";

export default async function validateGrades() {
  // Validate all grades in our database
  const ds = await getDataSource();
  ds.manager.find(RouteSchema).then((routes) => {
    routes.forEach((route) => {
      try {
        Grade.build(route.gradeRaw);
      } catch (e) {
        console.error(
          `Invalid grade ${route.gradeRaw} for route ${route.name} (${route.id})`
        );
      }
    });
    console.log(`validated ${routes.length} grades`);
    process.exit(0);
  });
}

validateGrades();
