import { ObjectLiteral, Repository } from "typeorm";

/**
 * adaptedRepository returns a custom repo that adapts TypeORM entity to domain model
 * for commonly used repo methods
 * Note due to type definitions in TypeORM, we can't override existing methods --
 * instead we use the pattern to define new methods `{name}T`
 */
function adaptedRepository<Entity extends ObjectLiteral, Model>(
  repo: Repository<Entity>,
  // Adapter adapts schema to model, and nulls to undefined for extra clarity
  adapter: (schema: Entity | null) => Model | undefined
) {
  return repo.extend({
    findOneT: async (...args: Parameters<(typeof repo)["findOne"]>) => {
      const entity = await repo.findOne(...args);
      return adapter(entity);
    },
    saveT: async (...args: Parameters<(typeof repo)["save"]>) => {
      const entity = await repo.save(...args);
      return adapter(entity);
    },
  });
}

export default adaptedRepository;
