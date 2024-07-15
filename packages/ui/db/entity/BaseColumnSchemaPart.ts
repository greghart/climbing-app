import { EntitySchemaColumnOptions } from "typeorm";

const BaseColumnSchemaPart = {
  id: {
    type: Number,
    primary: true,
    generated: true,
  } as EntitySchemaColumnOptions,
  createdAt: {
    name: "created_at",
    type: "date",
    createDate: true,
  } as EntitySchemaColumnOptions,
  updatedAt: {
    name: "updated_at",
    type: "date",
    updateDate: true,
  } as EntitySchemaColumnOptions,
};

export default BaseColumnSchemaPart;
