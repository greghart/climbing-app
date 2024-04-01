import { Return } from "typescript-rest";
import type { ArgumentTypes } from "../../externals";
import type { CragsServiceType } from "../services/CragsService";
import type { AreasServiceType } from "../services/AreasService";
import type { BouldersServiceType } from "../services/BouldersService";
import type { RoutesServiceType } from "../services/RoutesService";
import type { CommentablesServiceType } from "../services/CommentablesService";
import type { PhotoablesServiceType } from "../services/PhotoablesService";

/**
 * Setup a type-safe API client interface
 */

// Extract just methods from our services (just in case)
// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type BasicFunction = (...args: any[]) => any;
type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};
type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];
type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>;
// Extract wrapped return types
type ExtractNewResource<T> = T extends Promise<Return.NewResource<infer X>>
  ? Promise<X>
  : T;
type Extracted<Base> = {
  [Key in keyof Base]: Base[Key] extends BasicFunction
    ? (
        ...args: ArgumentTypes<Base[Key]>
      ) => ExtractNewResource<ReturnType<Base[Key]>>
    : Base[Key];
};
type APIType<Type> = Extracted<SubType<Type, BasicFunction>>;

/**
 * We manually declare our API interface.
 *
 * We could try to auto-generate this from the services, but for the client
 * implementation we want to avoid a codegen step.
 *
 * Additionally, we want to give a "tagged" interface similar to what
 * swagger-client will produce.
 */
interface APIClientInterface {
  crags: APIType<CragsServiceType>;
  areas: APIType<AreasServiceType>;
  boulders: APIType<BouldersServiceType>;
  routes: APIType<RoutesServiceType>;
  commentables: APIType<CommentablesServiceType>;
  photoables: APIType<PhotoablesServiceType>;
}

export { type APIClientInterface };
