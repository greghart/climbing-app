package service

import (
	"time"

	"github.com/prometheus/client_golang/prometheus"
)

var (
	metricsNamespace      = "service"
	metricsRequestCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
		Namespace: metricsNamespace,
		Name:      "request_count",
		Help:      "Count of service level requests by service and method",
	}, []string{"service", "method"})
	metricsRequestDuration = prometheus.NewHistogramVec(prometheus.HistogramOpts{
		Namespace: metricsNamespace,
		Name:      "request_duration_seconds",
		Help:      "Duration of service level requests by service and methods",
	}, []string{"service", "method"})
)

// index of service methods
var (
	getCragObserver     = requestObserver("crags", "get")
	listCragsObserver   = requestObserver("crags", "list")
	updateCragObserver  = requestObserver("crags", "update")
	updateTrailObserver = requestObserver("trails", "update")
	insertTrailObserver = requestObserver("trails", "insert")
)

func init() {
	prometheus.MustRegister(metricsRequestCounter)
	prometheus.MustRegister(metricsRequestDuration)
}

// requestObserver returns a function that can be used at top of a service method and deferred
// to automatically track all our service level metrics
func requestObserver(service, method string) func() func() {
	counter := metricsRequestCounter.WithLabelValues(service, method)
	durationer := metricsRequestDuration.WithLabelValues(service, method)
	return func() func() {
		start := time.Now()
		counter.Inc()
		return func() {
			durationer.Observe(time.Since(start).Seconds())
		}
	}
}
