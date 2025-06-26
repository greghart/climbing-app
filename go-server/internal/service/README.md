# Services

Service layer lies on top of the database repos.

It's responsible for stitching up requests that require multiple operations across entities,
whether long running transactions or large queries. 

Services correspond 1:1 to our HTTP/gRPC layer. Every public method should respond to an endpoint.