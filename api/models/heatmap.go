package models

import (
	ik8s "github.com/freckie/viz-rbac/internal/k8s"
)

type GetHeatmapSAResResp map[string]ik8s.RoleRules
