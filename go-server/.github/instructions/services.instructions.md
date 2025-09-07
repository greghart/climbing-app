---
applyTo: 'internal/service/**'
---

The service layer lies on top of the database repos.

It's responsible for stitching up requests that require multiple operations across entities,
whether long running transactions, larger queries, coordinated operations, etc.

Since we're so high level, every service can directly access every other service, and we embrace the
lack of isolation/potential for circular dependencies in favor of the ease of use.

When developing services, we should:

- Setup a `servicep.IncludeSchema` for any read inclusions
- Setup dedicated options structs for every method, even if simple. This lets every method have
  a signature of `func(ctx context.Context, req *Options) (Results, error)`
- Write request structs should embed `*servicep.FieldMask` to dictate which fields are being updated.
  This field mask should be used to only apply requested updates.
- Every write request should include a `RequestedAt time.Time` field, which cross checks the model
  `UpdatedAt` timestamp to ensure the request is not stale.
- Every service method should add new `requestObserver` metrics to `internal/service/metrics.go`
  and call the observer at the start of the method.
