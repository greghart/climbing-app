package service

import (
	"time"

	"github.com/prometheus/client_golang/prometheus"
)

var (
	namespace      = "service"
	requestCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
		Namespace: namespace,
		Name:      "request_count",
		Help:      "Count of service level requests by service and method",
	}, []string{"service", "method"})
	requestDuration = prometheus.NewHistogramVec(prometheus.HistogramOpts{
		Namespace: namespace,
		Name:      "request_duration_seconds",
		Help:      "Duration of service level requests by service and methods",
	}, []string{"service", "method"})
)

// index of service methods
var (
	getCragObserver   = requestObserver("crags", "getCrag")
	listCragsObserver = requestObserver("crags", "listCrags")
)

func init() {
	prometheus.MustRegister(requestCounter)
	prometheus.MustRegister(requestDuration)
}

// requestObserver returns a function that can be used at top of a service method and deferred
// to automatically track all our service level metrics
func requestObserver(service, method string) func() func() {
	counter := requestCounter.WithLabelValues(service, method)
	durationer := requestDuration.WithLabelValues(service, method)
	return func() func() {
		start := time.Now()
		counter.Inc()
		return func() {
			durationer.Observe(time.Since(start).Seconds())
		}
	}
}
