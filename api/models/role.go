package models

import (
	ik8s "github.com/freckie/viz-rbac/internal/k8s"
)

type GetRolesByServiceAccountResp struct {
	Roles      []ik8s.RoleResult `json:"roles"`
	RolesCount int               `json:"roles_count"`
}

type GetRoleResp struct {
	Resources      ik8s.RoleRules `json:"resources"`
	ResourcesCount int            `json:"resources_count"`
}

type GetClusterRoleResp struct {
	Resources      ik8s.RoleRules `json:"resources"`
	ResourcesCount int            `json:"resources_count"`
}
