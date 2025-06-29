package http

import (
	"time"

	"github.com/prometheus/client_golang/prometheus"
)

var (
	httpNamespace      = "http"
	httpRequestCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
		Namespace: httpNamespace,
		Name:      "request_count",
		Help:      "Count of HTTP requests by method and path",
	}, []string{"method", "path"})
	httpRequestDuration = prometheus.NewHistogramVec(prometheus.HistogramOpts{
		Namespace: httpNamespace,
		Name:      "request_duration_seconds",
		Help:      "Duration of HTTP requests by method and path",
	}, []string{"method", "path"})
)

func init() {
	prometheus.MustRegister(httpRequestCounter)
	prometheus.MustRegister(httpRequestDuration)
}

// httpRequestObserver returns a function to be used at the top of an HTTP handler and deferred
// to automatically track HTTP layer metrics.
func httpRequestObserver(method, path string) func() {
	counter := httpRequestCounter.WithLabelValues(method, path)
	durationer := httpRequestDuration.WithLabelValues(method, path)
	start := time.Now()
	counter.Inc()
	return func() {
		durationer.Observe(time.Since(start).Seconds())
	}
}
