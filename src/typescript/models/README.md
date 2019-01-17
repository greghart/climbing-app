# TypeORM Models Layer

This document will serve to document how we're using TypeORM to manage our 
model layer, and any specific details.

## Lazy loading

TypeORM currently has two modes for an association -- always eager load, or always 
lazy load. That is, this is specified during model declaration.

Lazy loading is implemented by having relations wrapped in Promises.
