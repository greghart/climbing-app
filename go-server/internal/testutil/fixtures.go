package testutil

import (
	"encoding/json"
	"os"
	"testing"

	"github.com/greghart/climbing-app/internal/config"
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/powerputtygo/errcmp"
)

func LoadCragFromJSON(t testing.TB, path string) *models.Crag {
	root, err := os.OpenRoot(config.Load().RootDir)
	errcmp.MustMatch(t, err, "")
	defer root.Close()

	f, err := root.Open(path)
	if err != nil {
		t.Fatalf("failed to open crag JSON file %s: %v", path, err)
	}
	defer f.Close()

	var crag models.Crag
	if err := json.NewDecoder(f).Decode(&crag); err != nil {
		t.Fatalf("failed to load expected crag: %v", err)
	}
	return &crag
}
