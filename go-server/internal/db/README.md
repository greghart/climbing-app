# DB Layer

Persistence layer is a sqlite database.

Note, most conventions are always commented upon in `db/crag` as the first iteration.

## IDs

Technically, when an entity hasn't been persisted yet, we have no ID and one may consider it nil.
However, they are required in schema, and so this codebase chooses to use normal `int64`s for
simplicity, with the convention that 0 value indicates the entity is not saved or non existent 
(when embedded for example)

Pointer primitives (or `sql.NullX`) should still be used for nullable columns.

## Parameters

Always prefer a slice parameter over a primitive (eg. `IDs` over `ID`), since the former can model
the latter, but not vice versa. No need to worry about performance between `id = :id` and `id IN (:ids)`.

## Relationships

Generally, a parent (has many, has one side) can embed child data, while the child should just keep
the identifier.

Eg. Crag has `Areas []Area`, but Area just has `CragID int`. This keeps data mostly one directional,
and minimizes bad expectations around circular data. Additionally, we can mostly keep these IDs
out of the serialization layer (json/protobuf).

## Performance

Generally for database performance, assuming you are using indices properly and not doing anything
obviously wrong, the main perf decision to make is when fetching relationships. For N relationships,
you can generally either Join N tables or make 1+N queries.

Obviously without proper benchmarking, performance between these two options will always be a 
question mark.

Instead, use your judgement for which approach to take, and consider [maintainability](#maintainability)
as the first priority, adn then handle performance as required by performance testing.

## Maintainability

The design of our persistence layer code should align to Go style simplicity -- we avoid ORMs, and
`powerputty` can be used for dynamic queries, scanning, data mapping, etc. As long as the flow is 
maintained and the code is clear, anything should work.

As far as the joins vs multiple queries, those do have maintenance costs.

Joins:
* \+ One repo can field all the data it needs directly
* \+ SQL is fun?!?!
* \+ It can feel gratifying
* \- More complicated SQL
* \- Multiple repos will end up having similar SQL
* \- 1:N relationships are harder to map in memory (needs `mapperp`)

Multiple Queries:
* \+ Queries can be kept fairly simple and repo specific
* \+ Less query re-use across repos
* \- One request would need to hit multiple repos
* \- We still need the data mapping, just happens in a different layer (or repo interdependencies)
* \- You don't get to flex your SQL as much

Either way, we should also keep user and wire concerns in mind. While it may be more "maintainable"
to always return all the crag data ever needed in one method, a user doesn't necessarily want that 
overhead, and we shouldn't ignore bandwidth costs either.  Eg. if you need to join N entities to 
get data for one API, but for another you only need 1, then ensure you're not using the same 
database calls. `servicep.IncludeSchema` should help compose this logic up nicely.
