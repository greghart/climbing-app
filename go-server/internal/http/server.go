package http

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/greghart/climbing-app/internal/config"
)

type Server struct {
	env  *config.Env
	opts Options
}

type Options struct {
	ExpectedHost string
}

func NewServer(env *config.Env, opts Options) *Server {
	return &Server{
		env:  env,
		opts: opts,
	}
}

func (s *Server) Start() error {
	if s.opts.ExpectedHost == "" {
		return fmt.Errorf("ExpectedHost must be set in server options")
	}
	httpServer := &http.Server{
		Addr:           ":8080",
		Handler:        s.Handler(),
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	return httpServer.ListenAndServe()
}

func (s *Server) Stop() {
}

func (s *Server) Handler() http.Handler {
	r := gin.Default()

	r.Use(apiKeyAuthMiddleware())
	r.Use(securityHeaders(s.opts.ExpectedHost))

	{
		v1 := r.Group("/v1")

		{
			crags := v1.Group("/crags")
			crags.GET("", s.getCrags)
			crags.GET("/:id", s.getCrag)
		}
	}

	return r
}

////////////////////////////////////////////////////////////////////////////////
// Handlers

func (s *Server) getCrags(c *gin.Context) {
	crags, err := s.env.Repos.Crags.GetCrags(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to get crags: %v", err)})
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

	crag, err := s.env.Repos.Crags.GetCrag(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("failed to get crag %v: %v", id, err)})
		return
	}
	if crag == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("failed to find crag %v", id)})
		return
	}

	c.JSON(http.StatusOK, crag)
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
	return func(c *gin.Context) {
		apiKey := os.Getenv("API_KEY")
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
