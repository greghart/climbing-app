import BaseColumnSchemaPart from "@/db/entity/BaseColumnSchemaPart";
import { IUpload } from "models/lib/Upload";
import { EntitySchema } from "typeorm";

export type Upload = IUpload;

const UploadSchema = new EntitySchema<Upload>({
  name: "upload",
  columns: {
    ...BaseColumnSchemaPart,
    key: {
      type: String,
      unique: true,
    },
    directory: {
      type: String,
    },
    engine: {
      type: String,
    },
    originalName: {
      type: String,
    },
    fileSize: {
      type: "integer",
    },
    sha1Hash: {
      type: String,
    },
    uploadedAt: {
      type: "date",
    },
  },
  relations: {
    photo: {
      type: "one-to-one",
      target: "photo",
    },
  },
});

export default UploadSchema;
