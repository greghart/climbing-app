package http

import (
	"time"

	"github.com/prometheus/client_golang/prometheus"
)

var (
	metricsNamespace      = "http"
	metricsRequestCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
		Namespace: metricsNamespace,
		Name:      "request_count",
		Help:      "Count of HTTP requests by method and path",
	}, []string{"method", "path"})
	metricsRequestDuration = prometheus.NewHistogramVec(prometheus.HistogramOpts{
		Namespace: metricsNamespace,
		Name:      "request_duration_seconds",
		Help:      "Duration of HTTP requests by method and path",
	}, []string{"method", "path"})
)

func init() {
	prometheus.MustRegister(metricsRequestCounter)
	prometheus.MustRegister(metricsRequestDuration)
}

// httpRequestObserver returns a function to be used at the top of an HTTP handler and deferred
// to automatically track HTTP layer metrics.
func httpRequestObserver(method, path string) func() {
	counter := metricsRequestCounter.WithLabelValues(method, path)
	durationer := metricsRequestDuration.WithLabelValues(method, path)
	start := time.Now()
	counter.Inc()
	return func() {
		durationer.Observe(time.Since(start).Seconds())
	}
}
