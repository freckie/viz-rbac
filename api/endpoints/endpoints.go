package endpoints

import (
	ik8s "github.com/freckie/viz-rbac/internal/k8s"
)

type Endpoints struct {
	Client *ik8s.K8SClient
}
