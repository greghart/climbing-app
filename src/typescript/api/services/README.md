# Services

Utilizes `typescript-rest` to setup Tyepscript annotation based services that 
describe the API. This allows us to generate Swagger documentation and a
client for standardized workflow.

## Scaffolding

Currently, services are manually included in `api/index.ts`.

Swagger parameters will be inferred, but there is currently no support for complicated
types, so you may see explicit typings setup.

Additionally, the API is shared with the client, but must be manually whitelisted
in `ducks/operations/util/getSwagger`.
