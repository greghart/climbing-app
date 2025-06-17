---
applyTo: '**/_test.go'
---

When writing tests in Go, follow these guidelines:
* use errcmp to assert errors are empty like `errcmp.MustMatch(t, err, "")`.
* make data driven tests in a map[string]struct{input, expected} format, which
  are each ran using `t.Run`.
* except when obviously workin with primitives, use `cmp.Equal` for expectation checks
  and `cmp.Diff` for nice error messages.
* add helper functions at bottom of the file under a `goc` comment snippet (VS Code),
  and of course take `t *testing.T` as a first argument and `t.Helper()` them