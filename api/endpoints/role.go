package endpoints

import (
	"net/http"

	ihttp "github.com/freckie/viz-rbac/internal/http"
	"github.com/freckie/viz-rbac/models"

	"github.com/julienschmidt/httprouter"
)

// GetRolesByServiceAccount returns a list of roles bound to a specific ServiceAccount.
// GET /namespaces/{namespace}/service-accounts/{sa}/roles
func (e *Endpoints) GetRolesByServiceAccount(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	c := e.Client

	// Parse parameters
	namespace := ps.ByName("namespace")
	if namespace == "" {
		ihttp.ResponseError(w, 404, "Namespace not found.")
	}
	sa := ps.ByName("sa")
	if sa == "" {
		ihttp.ResponseError(w, 404, "ServiceAccount not found.")
	}

	result, err := c.GetRolesByServiceAccount(namespace, sa)
	if err != nil {
		ihttp.ResponseError(w, 500, err.Error())
	}

	resp := models.GetRolesByServiceAccountResp{
		Roles: result,
		Count: len(result),
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
	}
	role := ps.ByName("role")
	if role == "" {
		ihttp.ResponseError(w, 404, "Role not found.")
	}

	result, err := c.GetRole(namespace, role)
	if err != nil {
		ihttp.ResponseError(w, 500, err.Error())
	}

	resp := models.GetRoleResp{
		Resources: result,
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
	}
	crole := ps.ByName("crole")
	if crole == "" {
		ihttp.ResponseError(w, 404, "ClusterRole not found.")
	}

	result, err := c.GetClusterRole(crole)
	if err != nil {
		ihttp.ResponseError(w, 500, err.Error())
	}

	resp := models.GetClusterRoleResp{
		Resources: result,
	}
	ihttp.ResponseOK(w, "success", resp)
	return
}
