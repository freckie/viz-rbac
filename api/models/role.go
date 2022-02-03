package models

import (
	ik8s "github.com/freckie/viz-rbac/internal/k8s"
)

type GetRolesByServiceAccountResp struct {
	Roles []ik8s.RoleResult `json:"roles"`
	Count int               `json:"count"`
}

type GetRoleResp struct {
	Resources ik8s.RoleRules `json:"resources"`
}

type GetClusterRoleResp struct {
	Resources ik8s.RoleRules `json:"resources"`
}
