package endpoints

import (
	"net/http"

	ihttp "github.com/freckie/viz-rbac/internal/http"
	"github.com/freckie/viz-rbac/models"

	"github.com/julienschmidt/httprouter"
)

// GetServiceAccounts returns a list of ServiceAccounts.
// GET /namespaces/{namespace}/service-accounts
func (e *Endpoints) GetServiceAccounts(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	c := e.Client

	// Parse parameters
	namespace := ps.ByName("namespace")
	if namespace == "" {
		ihttp.ResponseError(w, 404, "Namespace not found.")
	}

	var _namespace string
	if namespace == "_all" {
		_namespace = ""
	} else {
		_namespace = namespace
	}

	saList, err := c.GetServiceAccounts(_namespace)
	if err != nil {
		ihttp.ResponseError(w, 500, err.Error())
	}

	resp := models.GetServiceAccountsResp{ServiceAccounts: saList}
	ihttp.ResponseOK(w, "success", resp)
	return
}
