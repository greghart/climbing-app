import { EntitySchemaColumnOptions } from "typeorm";

const BaseColumnSchemaPart = {
  id: {
    type: Number,
    primary: true,
    generated: true,
  } as EntitySchemaColumnOptions,
  createdAt: {
    name: "createdAt",
    type: "date",
    createDate: true,
  } as EntitySchemaColumnOptions,
  updatedAt: {
    name: "updatedAt",
    type: "date",
    updateDate: true,
  } as EntitySchemaColumnOptions,
};

export default BaseColumnSchemaPart;
