package db

import (
	"github.com/prometheus/client_golang/prometheus"
)

var (
	metricsNamespace    = "db"
	metricsQueryCounter = prometheus.NewCounter(prometheus.CounterOpts{
		Namespace: metricsNamespace,
		Name:      "query_count",
		Help:      "Count of db requests",
	})
	metricsQueryDuration = prometheus.NewHistogram(prometheus.HistogramOpts{
		Namespace: metricsNamespace,
		Name:      "query_duration_seconds",
		Help:      "Duration of db requests",
	})
)

func init() {
	prometheus.MustRegister(metricsQueryCounter)
	prometheus.MustRegister(metricsQueryDuration)
}
