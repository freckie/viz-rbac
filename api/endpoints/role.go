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

	resp := models.GetRolesByServiceAccountResp{Result: result}
	ihttp.ResponseOK(w, "success", resp)
	return
}
