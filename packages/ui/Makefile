protoc:
	@PATH="$(PATH):$(PWD)/node_modules/.bin" protoc \
		--proto_path ../../go-server/internal/pb \
		--es_out app/_grpc \
		--es_opt target=ts \
		../../go-server/internal/pb/*.proto
.PHONY: protoc