"use server";
// associationer helps with lazy loading associations
// In TypeORM, there are two cases for has one relationships:
// * if relation was explicitly loaded, but it doesn't exist, it will be null
// * if relation wasn't loaded at all, it will be undefined
// associationer resolves both cases to one basic API. Data or no data.
export default async function associationer<T>(
  val: T | null | undefined,
  getter: () => Promise<T | null | undefined>
): Promise<T | undefined> {
  // load if needed
  if (val === undefined) {
    val = await getter();
  }
  // resolve no data to undefined
  if (val === null) {
    return undefined;
  }
  return val;
}
