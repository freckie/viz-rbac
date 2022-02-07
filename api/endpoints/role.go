package endpoints

import (
	"net/http"

	ihttp "github.com/freckie/viz-rbac/internal/http"
	ik8s "github.com/freckie/viz-rbac/internal/k8s"
	"github.com/freckie/viz-rbac/models"

	"github.com/julienschmidt/httprouter"
)

// GetRolesByServiceAccount returns a list of roles bound to a specific ServiceAccount.
// GET /namespaces/{namespace}/service-accounts/{sa}/roles
func (e *Endpoints) GetRolesByServiceAccount(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	c := e.Client
	var result []models.RoleItem

	// Parse parameters
	namespace := ps.ByName("namespace")
	if namespace == "" {
		ihttp.ResponseError(w, 404, "Namespace not found.")
		return
	} else if namespace == "_all" {
		ihttp.ResponseError(w, 404, "\"_all\" is not supported for this endpoint.")
		return
	}
	sa := ps.ByName("sa")
	if sa == "" {
		ihttp.ResponseError(w, 404, "ServiceAccount not found.")
		return
	}

	// Get role names that are bound to the service account
	roles, err := c.GetRolesByServiceAccount(namespace, sa)
	if err != nil {
		ihttp.ResponseError(w, 500, err.Error())
		return
	}

	// Describe roles
	result = make([]models.RoleItem, 0)
	for _, role := range roles {
		var rules ik8s.RoleRules

		switch role.Kind {
		case "Role":
			rules, _ = c.GetRole(namespace, role.Name)
		case "ClusterRole":
			rules, _ = c.GetClusterRole(role.Name)
		}

		result = append(result, models.RoleItem{
			Kind:           role.Kind,
			Name:           role.Name,
			Resources:      rules,
			ResourcesCount: len(rules),
		})
	}

	// Make response
	resp := models.GetRolesByServiceAccountResp{
		Roles:      result,
		RolesCount: len(result),
	}
	ihttp.ResponseOK(w, "success", resp)
	return
}

// GetRole describes a specific Role.
// GET /namespaces/{namespace}/roles/{role}
func (e *Endpoints) GetRole(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	c := e.Client

	// Parse parameters
	namespace := ps.ByName("namespace")
	if namespace == "" {
		ihttp.ResponseError(w, 404, "Namespace not found.")
		return
	} else if namespace == "_all" {
		ihttp.ResponseError(w, 404, "\"_all\" is not supported for this endpoint.")
		return
	}
	role := ps.ByName("role")
	if role == "" {
		ihttp.ResponseError(w, 404, "Role not found.")
		return
	}

	result, err := c.GetRole(namespace, role)
	if err != nil {
		ihttp.ResponseError(w, 500, err.Error())
		return
	}

	resp := models.GetRoleResp{
		Kind:           "Role",
		Name:           role,
		Resources:      result,
		ResourcesCount: len(result),
	}
	ihttp.ResponseOK(w, "success", resp)
	return
}

// GetClusterRole describes a specific ClusterRole.
// GET /namespaces/{namespace}/cluster-roles/{crole}
func (e *Endpoints) GetClusterRole(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	c := e.Client

	// Parse parameters
	namespace := ps.ByName("namespace")
	if namespace == "" {
		ihttp.ResponseError(w, 404, "Namespace not found.")
		return
	} else if namespace == "_all" {
		ihttp.ResponseError(w, 404, "\"_all\" is not supported for this endpoint.")
		return
	}
	crole := ps.ByName("crole")
	if crole == "" {
		ihttp.ResponseError(w, 404, "ClusterRole not found.")
		return
	}

	result, err := c.GetClusterRole(crole)
	if err != nil {
		ihttp.ResponseError(w, 500, err.Error())
		return
	}

	resp := models.GetClusterRoleResp{
		Kind:           "ClusterRole",
		Name:           crole,
		Resources:      result,
		ResourcesCount: len(result),
	}
	ihttp.ResponseOK(w, "success", resp)
	return
}
