# Go Server

A Go server to provide APIs for the climbing app.

## Service pattern

This application uses a very light abstraction of Start/Stop functions. Any long running service
should provide a `Start() error` function that will dictate whether it was started successfully.
It should also provide a `Stop()` function for any cleanup. This is purely a convention to make
start up and tear down obvious and predictable.

## Metrics/observability

Prometheus is used as the monitoring database. Metrics should be colocated in a `metrics.go` file
for each package, rather than polluting each file individually. This is just a convention to
make it easier to see what metrics we support at a glance. Similarly, any custom metric should
include `{package}_` as a prefix, unless otherwise obvious.