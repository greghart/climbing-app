# Services

Service layer lies on top of the database repos.

It's responsible for stitching up requests that require multiple operations across entities,
whether long running transactions, larger queries, coordinated operations, etc.

Since we're so high level, every service can directly access every other service, and we embrace the
lack of isolation/potential for circular dependencies in favor of the ease of use.
