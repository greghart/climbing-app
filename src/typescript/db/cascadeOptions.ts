// Some default cascade options to make things a bit easier to work with
import { RelationOptions } from 'typeorm';

// Cascade one to many -- we want nested creates and updates to persist
export const cascadeOneToMany: RelationOptions = {
  cascade: ['insert', 'update']
};

// Cascade many to one -- we want parent owner delets to cascade to children
export const cascadeManyToOne: RelationOptions = {
  cascade: ['remove'],
  onDelete: 'CASCADE'
};
