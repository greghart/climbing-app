# Models

Dart classes of our domain climbing models.

One distinction from `packages/models`: a parent will have children,
but children will never have a pointer back to the parent. In Flutter,
we'll use provider context for accessing the ancestry tree.

During deserialization, unexpected data maps as null, and we'd expect consumers
to handle this correctly.