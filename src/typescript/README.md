# Feature breakdown

For adding a feature, here are the places that need to happen

1. Model `models/[model].ts`

    The business model entities, that are persisted to a database. 
    Uses TypeORM to maintain abstraction over database.

    1. Repository -- optional layer for defining more complex database 
    interactions. Note this is not the place for business logic.
    1. Migrations -- implementation details hidden behind NPS.

        `nps db.migration.generate --name=[name]`

        `nps db.migration.run`

1. Service  `api/services/[service].ts`

    The external API declarations, describing both the HTTP directives as well 
    as Swagger Standard API directives. Server-side validation is also done
    here. 

1. Operations `api/operations/[operation].ts`

    The business level operations that our application supports. These are just
    basic functions that operate on the entities declared in "Model".
    Note, there's pragmatism for what's a business operation verse what's a 
    direct component of the model.

1. Codec `codecs/[codec].ts`

    A codec declares both the input and output of data objects when 
    communicating between across type-safe boundary (for example, client <-> 
    server, user input data <-> validation).

1. Client Components `redux/components/[feature]/[component].ts`

    These are the pure React components for presenting the feature, as well as
    the Redux containers for connecting to state and actions.

1. Client Ducks `redux/ducks/[duck].ts`. 

    See `ducks/README.md` for details, but basically where we declare the 
    client business state and state changes necessary for the feature.
  
1. Client Operations `redux/ducks/operations/[operation].ts`

    Analogous to server operations, these are simple business functions that 
    map to a service API. 

    1. getSwagger `redux/duckers/operations/util/getSwagger.ts`

        This is a implementation detail interface that's needed to bridge 
        Typescript types between client operations and services. 
        Technically this could be resolved in a codegen step, but for 
        simplicity we choose to skip that, and explicitly define what 
        services the client will consume.

1. Client Routes `redux/getRoutes`

    Any routes/pages that the feature will expose to clients. Note there's no 
    need for these to line up with service API whatsoever.

1. Client Model `redux/normalizr.ts`

    Analogous to our mode layer, the client must know about the relationships 
    of entities, in order to more efficiently organize client state.
