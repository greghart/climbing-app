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
you can generally either Join N tables or make N+1 queries.

Obviously without proper benchmarking, and at the scale of the amount of data we are working with,
performance between these two options remains a question mark. Instead, use your judgement for 
which approach to take, and more importantly, keep things as flexible as possible. 
Eg. if you need to join N entities to get data for one API, but for another you only need 1, then
ensure you're not using the same database calls.

If you do decide to make N separate queries, ensure you use concurrency for non interdependent
queries so we're not waiting on N round trips to database.

## Cleanliness

The other side to the above decision is what's cleanest. Database should always be very local to
the server, so it's probably fine to do full tree populations in memory instead of through massive
joins.