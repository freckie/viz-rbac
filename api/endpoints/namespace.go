package endpoints

import (
	"net/http"

	ihttp "github.com/freckie/viz-rbac/internal/http"
	"github.com/freckie/viz-rbac/models"

	"github.com/julienschmidt/httprouter"
)

func (e *Endpoints) GetNamespaces(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	c := e.Client

	nsList, err := c.GetNamespaces()
	if err != nil {
		ihttp.ResponseError(w, 500, err.Error())
	}

	resp := models.GetNamespacesResp{Namespaces: nsList}
	ihttp.ResponseOK(w, "success", resp)
	return
}
