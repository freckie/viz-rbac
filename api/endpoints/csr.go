package endpoints

import (
	"net/http"

	ihttp "github.com/freckie/viz-rbac/internal/http"
	"github.com/freckie/viz-rbac/models"

	"github.com/julienschmidt/httprouter"
)

func (e *Endpoints) GetCSRs(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	c := e.Client

	csrList, err := c.GetCSRs()
	if err != nil {
		ihttp.ResponseError(w, 500, err.Error())
		return
	}

	resp := models.GetCSRResp{
		CSRs:     csrList,
		CSRCount: len(csrList),
	}
	ihttp.ResponseOK(w, "success", resp)
	return
}
