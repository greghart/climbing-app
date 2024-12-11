# API layer

Sometimes we need a route handler, which is a more conventional
JSON based server API, and sometimes we can call operations directly 
through server components.

API layer always return values that implement `@/models`, and should
not leak implementation layer as much as possible.