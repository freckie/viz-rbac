package models

type GetNamespacesResp struct {
	Namespaces      []string `json:"namespaces"`
	NamespacesCount int      `json:"namespaces_count"`
}
