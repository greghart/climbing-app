# gRPC

Protobuf/gRPC declarations are in the `pb` package.

## API Design Decisions

* Use `google.protobuf.FieldMask` for writes, but use the more intentional `repeated string includes`
  for reads. `FieldMask` specifically targets fields, while latter represents associations (and 
  we don't support only selecting certain fields in fact).
* Re-use our domain messages for updates and writes  -- application layer will handle whether 
  certain fields aren't valid for updating/writing (such as db ids).
* Every update should include a requested at timestamp -- if the entity has since been updated,
  the update will be a no-op. For insert worries about idempotency,
