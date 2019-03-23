# TypeORM Models Layer

This document will serve to document how we're using TypeORM to manage our 
model layer, and any specific details.

## Lazy loading

TypeORM currently has two modes for an association -- always eager load, or always 
lazy load. That is, this is specified during model declaration.

Lazy loading is implemented by having relations wrapped in Promises.
Unfortunately, this forces us on the client to setup different typings, as model data will
be already loaded. Instead, we have a non type-safe method of using neither -- if we 
want data to be there, we must coordinate with the operaton to fetch it.

## Cascade

Relationship cascades allow us to save or update a parent, and have children automatically update
as well. This can be more dangerous, as we may accidentally allow updates we didn't want, or 
result in orphaned entities. 

Currently, there's not a best practice of how to do it. Cascades allow somewhat simpler operations
while no cascades require explicit orchestration.
