GOFMT_FILES = $(shell go list -f '{{.Dir}}' ./... | grep -v '/pb')
GO_FILES = $(shell find . -name \*.go)
MD_FILES = $(shell find . -name \*.md)

# run a server in watch mode
server:
	wgo run ./cmd/server/main.go
.PHONY: server

# run a server in bg (clean up with `make clean`)
bg_server:
	 go build -o tmp/server ./cmd/server/main.go
	 ./tmp/server & echo $$! > server.pid
.PHONY: bg_server

# clean kills any background processes created by this makefile
clean:
	@if [ -f "server.pid" ]; then \
		SERVER_PID=$$(cat server.pid) ; \
		kill $$SERVER_PID ; \
		echo "Killed server process $$SERVER_PID" ; \
		rm server.pid ; \
	fi
	@if [ -f "tmp/server" ]; then \
		rm tmp/server ; \
	fi
.PHONY: clean

# Protoc
protoc:
	@protoc --proto_path=./internal/pb \
		--go_out=internal/pb \
		--go_opt=paths=source_relative \
		--go-grpc_out=internal/pb \
		--go-grpc_opt=paths=source_relative \
		./internal/pb/*.proto
.PHONY: protoc

# DB Migrations
# requires golang-migrate to be installed
migrate:
	@migrate
		-e sql \
		-d ./migrations \
		up

migrate_new:
	migrate \
		create \
		-ext sql \
		-dir ./migrations \
		${arg} 

# diff-check runs git-diff and fails if there are any changes.
diff-check:
	@FINDINGS="$$(git status -s -uall)" ; \
		if [ -n "$${FINDINGS}" ]; then \
			echo "Changed files:\n\n" ; \
			echo "$${FINDINGS}\n\n" ; \
			echo "Diffs:\n\n" ; \
			git diff ; \
			git diff --cached ; \
			exit 1 ; \
		fi
.PHONY: diff-check

# lint uses the same linter as CI and tries to report the same results running
# locally. There is a chance that CI detects linter errors that are not found
# locally, but it should be rare.
lint:
	@go tool golangci-lint run
	@protolint lint ./internal/pb/*.proto
.PHONY: lint

test:
	@go test \
		-shuffle=on \
		-count=1 \
		-short \
		-timeout=5m \
		./...
.PHONY: test

test-acc:
	@go test \
		-shuffle=on \
		-count=1 \
		-race \
		-timeout=10m \
		./... \
		-coverprofile=coverage.out
.PHONY: test-acc

test-coverage:
	@go tool cover -func=./coverage.out
.PHONY: test-coverage
