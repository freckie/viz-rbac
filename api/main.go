package main

import (
	"log"
	"net/http"

	"github.com/freckie/viz-rbac/endpoints"
	ik8s "github.com/freckie/viz-rbac/internal/k8s"

	"github.com/julienschmidt/httprouter"
	"github.com/rs/cors"
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

	// Resource endpoints
	router.GET("/api/res/v1/namespaces", ep.GetNamespaces)
	router.GET("/api/res/v1/namespaces/:namespace/service-accounts", ep.GetServiceAccounts)
	router.GET("/api/res/v1/namespaces/:namespace/service-accounts/:sa/roles", ep.GetRolesByServiceAccount)
	router.GET("/api/res/v1/namespaces/:namespace/roles/:role", ep.GetRole)
	router.GET("/api/res/v1/namespaces/:namespace/cluster-roles/:crole", ep.GetClusterRole)

	// Aggregated endpoints for visualization
	router.GET("/api/agg/v1/heatmap/sa-res/:namespace", ep.GetHeatmapSARes)
	router.GET("/api/agg/v1/heatmap/user-ns", ep.GetHeatmapUserNS)

	// Serve
	handler := cors.AllowAll().Handler(router)
	log.Println("Starting HTTP API Server on port", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
