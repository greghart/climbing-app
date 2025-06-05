import { ClimbService } from "@/app/_grpc/climb_pb";
import { createClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import "server-only";

const transport = createGrpcTransport({
  baseUrl: "http://localhost:8081",
  interceptors: [
    (nxt) => (req) => {
      req.header.set(
        "authorization",
        `Bearer ${process.env.NEXT_PUBLIC_GRPC_TOKEN}`
      );
      return nxt(req);
    },
  ],
});
const client = createClient(ClimbService, transport);

export default client;
