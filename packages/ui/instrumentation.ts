import { getDataSource } from "@/db";

/**
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 * Wait for datasource before
 */
export async function register() {
  const ds = await getDataSource();
}
