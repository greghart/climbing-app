import { Message } from "@bufbuild/protobuf";

export type ExtractMessage<T> = Omit<T, keyof Message>;
