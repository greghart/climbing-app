# Climbing App Models

The business models of climbing app.
Note this package doesn't include any persistence layer, to let it be easily consumed by web clients
or for other light testing purposes.

## Implementation notes

This is the model layer -- the exact schemas we'll persist are setup separately in `@ui/db/entity` but some implementation concerns may be leaked here:

* IDs are almost always required by database, but obviously only once persisted. Therefore id properties must be optional
* Associations are all setup bi-directionally -- similar to above, while there may be application level constraints,
empty types must be allowed to account for partial data loads and different use cases.
* Interfaces describe the shape of the data, while classes are provided to include behavior as well. 