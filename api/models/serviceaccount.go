package models

import (
	ik8s "github.com/freckie/viz-rbac/internal/k8s"
)

type GetServiceAccountsResp struct {
	ServiceAccounts      []ik8s.ServiceAccountResult `json:"serviceaccounts"`
	ServiceAccountsCount int                         `json:"serviceaccounts_count"`
}
