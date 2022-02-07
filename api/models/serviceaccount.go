package models

type GetServiceAccountsResp struct {
	ServiceAccounts      []string `json:"serviceaccounts"`
	ServiceAccountsCount int      `json:"serviceaccounts_count"`
}
