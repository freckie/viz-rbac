package models

import (
	ik8s "github.com/freckie/viz-rbac/internal/k8s"
)

type GetCSRResp struct {
	CSRs     []ik8s.CSRResult `json:"csrs"`
	CSRCount int              `json:"csrs_count"`
}

type PatchCSRApprovalReq struct {
	Condition string `json:"condition"`
	Reason    string `json:"reason"`
	Message   string `json:"message"`
}

type PatchCSRApprovalResp struct {
	ChangedCondition string `json:"changed_condition"`
}
