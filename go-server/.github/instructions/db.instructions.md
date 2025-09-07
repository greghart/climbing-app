---
applyTo: 'internal/db/**'
---

Note, when needed, look at `internal/db/area.go` to model conventions after. 

Every file should be a single model repository, and the file name should match the model name.

When writing repository code, you should:
* understand it's a sqlite database, but still try and write agnostic SQL when possible.
* embed a `*sqlp.Repository`, with an identifier, typed for the model
* use a `*queryp.Template` for any complex queries that join or do anything else that requires hand
  written SQL.
* use `mapperp.Mapper` to map rows to models when modelling 1:N relationships
  * setup a new `modelRow` struct that represents the flat row structure. Declare this under the
    repository.
  * setup a private `getMapper() mapperp.Mapper[modelRow, models.Model]` field that maps this row
    struct to your model struct.