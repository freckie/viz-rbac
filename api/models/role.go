package models

import (
	ik8s "github.com/freckie/viz-rbac/internal/k8s"
)

type RoleItem struct {
	Kind           string         `json:"kind"`
	Name           string         `json:"name"`
	Resources      ik8s.RoleRules `json:"resources"`
	ResourcesCount int            `json:"resources_count"`
}

type GetRolesByServiceAccountResp struct {
	Roles      []RoleItem `json:"roles"`
	RolesCount int        `json:"roles_count"`
}
type GetRoleResp RoleItem
type GetClusterRoleResp RoleItem
