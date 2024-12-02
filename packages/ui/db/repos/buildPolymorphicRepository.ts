import { get } from "lodash-es";
import { EntitySchema, Repository } from "typeorm";

// Base interface for a polymorhpic containing entity
// Eg. a commentable has a commentable
type PolymorphicableEntity<T, K extends keyof T> = { id?: any } & {
  [key in K]?: T;
};

export default function buildPolymorphicRepository<
  T,
  K extends string & keyof T
>(repo: Repository<PolymorphicableEntity<T, K>>, key: K) {
  const polymorphicRepo = repo.extend({
    [key]: {
      async findOrGet(
        entity: PolymorphicableEntity<T, K>,
        schema: EntitySchema<any>
      ) {
        // Find an existing, if any
        let polymorph = entity[key]
          ? entity[key]
          : get(
              await this.manager
                .getRepository(schema)
                .createQueryBuilder("entity")
                .innerJoinAndSelect(`entity.${key}`, key)
                .whereInIds(entity.id)
                .getOne(),
              key
            );
        if (!polymorph) {
          polymorph = {
            descriptor: `${schema.options.name}-${entity.id}`,
          };
          await this.manager.getRepository(schema).save(polymorph);
          entity[key] = polymorph;
          await this.manager.getRepository(schema).save(entity);
        }
        return polymorph;
      },
      async addOn(
        entity: PolymorphicableEntity<T, K>,
        schema: EntitySchema<any>,
        target: PolymorphicableEntity<T, K>
      ) {
        target[key] = await this[key].findOrGet(entity, schema);
        return this.manager.getRepository(schema).save(target);
      },
    },
  });
}
