package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"time"

	"github.com/greghart/climbing-app/internal/config"
	envpkg "github.com/greghart/climbing-app/internal/env"
	"github.com/greghart/climbing-app/internal/grpc"
	myhttp "github.com/greghart/climbing-app/internal/http"
)

func main() {
	cfg := config.Load()
	env := envpkg.New(cfg)
	defer env.Stop()

	// Handle SIGINT (CTRL+C) gracefully.
	ctx, stopSig := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stopSig()

	// Spin up environment
	if err := env.Start(); err != nil {
		log.Fatalf("failed to start environment: %v", err)
	}

	server := myhttp.NewServer(env, myhttp.Options{
		ExpectedHost: cfg.ExpectedHost,
		Port:         cfg.HTTPPort,
	})
	go func() {
		if err := server.Start(); !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("Failed to start http server: %v", err)
		}
	}()

	grpcServer := grpc.NewServer(env, grpc.Options{
		ExpectedHost: cfg.ExpectedHost,
		Port:         cfg.GRPCPort,
	})
	go func() {
		if err := grpcServer.Start(); err != nil {
			log.Fatalf("Failed to start grpc server: %v", err)
		}
	}()

	// Waiting for SIGINT (kill -2)
	log.Println("Press Ctrl+C to stop the servers...")
	<-ctx.Done()

	// Shutdown both servers gracefully
	log.Println("Shutting down servers...")
	// Use a WaitGroup to wait for both servers to stop
	var wg sync.WaitGroup
	wg.Add(2)
	waitCh := make(chan struct{})
	go func() {
		wg.Wait()
		close(waitCh)
	}()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	go func() {
		defer wg.Done()
		if err := server.Stop(ctx); err != nil {
			// handle err
			log.Printf("failed to stop http server: %v", err)
		}
	}()
	go func() {
		defer wg.Done()
		grpcServer.Stop()
	}()

	for {
		select {
		case <-waitCh:
			log.Printf("servers stopped gracefully")
			os.Exit(0)
		case <-ctx.Done():
			log.Printf("shutdown timed out, servers may not have stopped gracefully")
			os.Exit(1)
		}
	}
}
