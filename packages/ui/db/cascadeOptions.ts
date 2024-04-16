import { EntitySchemaRelationOptions } from "typeorm";

// Cascade one to many -- we want nested creates and updates to persist
export const cascadeOneToMany: Partial<EntitySchemaRelationOptions> = {
  cascade: ["insert", "update"],
};

// Cascade many to one -- we want parent owner delets to cascade to children
export const cascadeManyToOne: Partial<EntitySchemaRelationOptions> = {
  cascade: ["remove"],
  onDelete: "CASCADE",
};
