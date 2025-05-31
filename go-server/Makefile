GOFMT_FILES = $(shell go list -f '{{.Dir}}' ./... | grep -v '/pb')
GO_FILES = $(shell find . -name \*.go)
MD_FILES = $(shell find . -name \*.md)

server:
	wgo run ./cmd/server/main.go
.PHONY: server

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
	@go install github.com/golangci/golangci-lint/cmd/golangci-lint
	@golangci-lint run
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
