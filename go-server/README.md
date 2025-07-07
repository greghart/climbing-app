# Go Server

A Go server to provide APIs for the climbing app.

## Start/Stop pattern

This application uses a very light abstraction of Start/Stop functions. Any long running service
should provide a `Start() error` function that will dictate whether it was started successfully.
It should also provide a `Stop()` function for any cleanup. This is purely a convention to make
start up and tear down obvious and predictable.

## Metrics/observability

Prometheus is used as the monitoring database. Metrics should be colocated in a `metrics.go` file
for each package, rather than polluting each file individually. This is just a convention to
make it easier to see what metrics we support at a glance. Similarly, any custom metric should
include `{package}_` as a prefix, unless otherwise obvious.

## Validation

Because this project is supporting both HTTP and gRPC APIs, business logic validation should be
kept in the services package, and network bounds validation within their respective packages.
No validation library is chosen to allow the most flexible strategies -- I don't like struct tag
validations (they get noisy and hard to understand interdependent field validations), and anything
else doesn't look that different from vanilla, or worth the dependency.
