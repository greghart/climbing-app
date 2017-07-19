// Some default cascade options to make things a bit easier to work with
import * as typeorm from 'typeorm';

// Cascade one to many -- we want nested creates and updates to persist
export const cascadeOneToMany = {
  cascadeInsert: true,
  cascadeUpdate: true
};

// Cascade many to one -- we want parent owner delets to cascade to children
export const cascadeManyToOne: { onDelete: 'CASCADE' } = {
  onDelete: 'CASCADE'
};
