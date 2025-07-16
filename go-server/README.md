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

## Structure

* `config` -- dead simple config, uses dot files.
* `db` -- persistence layer and querying, per entity repositories
* `env` -- common state of a running server instance
* `http` / `grpc` -- dual network interface supporting gRPC and HTTP
* `models` -- domain entities (struct tags setup for [de]serializaton and sqlp)
* `pb` -- protobuf declarations and codegen 
* `services` -- handles the true business logic and anything that cuts across multiple repositories

### Dependency Highlights

* Minimize dependencies unless you really need them (or can't implement basic constructs yourself,
  like with powerputty). See [here](https://docs.google.com/presentation/d/e/2PACX-1vSmIbSwh1_DXKEMU5YKgYpt5_b4yfOfpfEOKS5_cvtLdiHsX6zt-gNeisamRuCtDtCb2SbTafTI8V47/pub?start=false&loop=false&delayms=3000&slide=id.g2f8587b72c7_0_243).
* web framework -> `gin`
  * 13 dependencies
  * useful enough to warrant an official (tutorial)[https://go.dev/doc/tutorial/web-service-gin]
  * basics like routing groups are a bit more straightfoward than vanilla, and request binding
    across sources (path, query, body) is nice, but overall vanilla is perfectly workable
* RPC -> `grpc` / `protobuf`
  * 20 dependencies / 1 dependency
  * definitely the best ecosystem and tooling for doing RPC. You can also proxy or annotate gRPC
    services to REST with something like (https://github.com/grpc-ecosystem/grpc-gateway), but I
    prefer the more explicit approach, since if you're building a REST API, your concerns are 
    different, and you don't want to be stuck with a leaky abstraction.
* configuration -> `godotenv`
  * 0 dependencies
  * very light and straightforward, easily worth it
  * for getting typed values, just implement yourself, learning a DSL seems a bit overkill for such
    a simple thing.