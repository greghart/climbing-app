package http

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/greghart/climbing-app/internal/env"
	"github.com/greghart/climbing-app/internal/models"
	"github.com/greghart/climbing-app/internal/service"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type Server struct {
	env  *env.Env
	http *http.Server
	opts Options
}

type Options struct {
	ExpectedHost string
	Port         int
}

func NewServer(env *env.Env, opts Options) *Server {
	return &Server{
		env:  env,
		opts: opts,
	}
}

func (s *Server) Start() error {
	if s.opts.ExpectedHost == "" {
		return fmt.Errorf("ExpectedHost must be set in server options")
	}
	if s.opts.Port == 0 {
		return fmt.Errorf("Port must be set in server options")
	}

	s.http = &http.Server{
		Addr:           fmt.Sprintf(":%d", s.opts.Port),
		Handler:        s.Handler(),
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	slog.Info(fmt.Sprintf("HTTP listening on port %d", s.opts.Port))
	return s.http.ListenAndServe()
}

func (s *Server) Stop(ctx context.Context) error {
	return s.http.Shutdown(ctx) // Gracefully shutdown the server
}

func (s *Server) Handler() http.Handler {
	r := gin.Default()

	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	r.Use(apiKeyAuthMiddleware())
	r.Use(securityHeaders(fmt.Sprintf("%s:%d", s.opts.ExpectedHost, s.opts.Port)))
	r.Use(func(ctx *gin.Context) {
		// Start the request observer for metrics
		defer httpRequestObserver(ctx.Request.Method, ctx.FullPath())()
		ctx.Next()
	})

	{
		v1 := r.Group("/v1")

		{
			crags := v1.Group("/crags")
			crags.GET("", s.listCrags)
			crags.GET("/:id", s.getCrag)
			crags.PATCH("/:id", s.updateCrag)
		}
	}

	return r
}

// //////////////////////////////////////////////////////////////////////////////
// Handlers

type cragsReadRequest struct {
	ID       int      `uri:"id"`
	Includes []string `form:"includes[]"`
}

func (s *Server) listCrags(c *gin.Context) {
	var req cragsReadRequest
	if err := c.ShouldBind(&req); err != nil {
		s.error(c, fmt.Errorf("Failed to bind request params: %v", err), http.StatusBadRequest)
		return
	}

	crags, err := s.env.Services.Crags.ListCrags(c.Request.Context(), service.CragsReadRequest{
		Include: service.CragsIncludeSchema.Include(req.Includes...),
	})
	if err != nil {
		s.error(c, fmt.Errorf("Failed to get crags: %v", err))
		return
	}

	c.JSON(http.StatusOK, crags)
}

func (s *Server) getCrag(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		s.error(c, fmt.Errorf("Invalid crag ID: %v", err), http.StatusBadRequest)
		return
	}
	var req cragsReadRequest
	if err = c.ShouldBind(&req); err != nil {
		s.error(c, fmt.Errorf("Failed to bind request params: %v", err), http.StatusBadRequest)
		return
	}

	crag, err := s.env.Services.Crags.GetCrag(c.Request.Context(), service.CragsReadRequest{
		ID:      int64(id),
		Include: service.CragsIncludeSchema.Include(req.Includes...),
	})
	if err != nil {
		s.error(c, fmt.Errorf("failed to get crag %v: %w", id, err))
		return
	}
	if crag == nil {
		s.error(c, fmt.Errorf("failed to find crag %v", id), http.StatusNotFound)
		return
	}

	c.JSON(http.StatusOK, crag)
}

type cragsUpdateRequest struct {
	ID        int          `uri:"id"`
	FieldMask []string     `json:"fieldMask"`
	Crag      *models.Crag `json:"crag"`
}

func (s *Server) updateCrag(c *gin.Context) {
	var update cragsUpdateRequest
	if err := c.ShouldBind(&update); err != nil {
		s.error(c, fmt.Errorf("could not bind request: %w", err))
	}

}

////////////////////////////////////////////////////////////////////////////////
// Helpers

func (s *Server) error(c *gin.Context, err error, _status ...int) {
	// TODO: Integrate logging solution, exception reporting
	// TODO: Implement error classifications -- don't surface unexpected errors to the user
	status := http.StatusInternalServerError
	if len(_status) == 1 {
		status = _status[0]
	}
	c.JSON(status, gin.H{"error": fmt.Sprintf("Failed to get crags: %v", err)})
}

////////////////////////////////////////////////////////////////////////////////
// Middleware

func apiKeyAuthMiddleware() gin.HandlerFunc {
	var apiKey = os.Getenv("API_KEY")

	return func(c *gin.Context) {
		reqKey := c.GetHeader("X-API-Key")
		if apiKey == "" || reqKey != apiKey {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		c.Next()
	}
}

func securityHeaders(expectedHost string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Host != expectedHost {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid host header"})
			return
		}
		c.Header("X-Frame-Options", "DENY")
		c.Header("Content-Security-Policy", "default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
		c.Header("Referrer-Policy", "strict-origin")
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("Permissions-Policy", "geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()")
		c.Next()
	}
}
