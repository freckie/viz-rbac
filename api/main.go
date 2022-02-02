package main

import (
	"log"
	"net/http"

	"github.com/freckie/viz-rbac/endpoints"
	ik8s "github.com/freckie/viz-rbac/internal/k8s"

	"github.com/julienschmidt/httprouter"
)

func main() {
	port := "8000"

	// Connect to the k8s cluster
	client, err := ik8s.LoadK8S()
	if err != nil {
		log.Fatal(err)
	}

	ep := endpoints.Endpoints{Client: &client}

	// Setting http router
	router := httprouter.New()
	router.GET("/namespaces", ep.GetNamespaces)

	// Serve
	log.Println("Starting HTTP API Server on port", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
