package endpoints

import (
	"encoding/json"
	"net/http"

	ihttp "github.com/freckie/viz-rbac/internal/http"
	ik8s "github.com/freckie/viz-rbac/internal/k8s"
	"github.com/freckie/viz-rbac/models"

	"github.com/julienschmidt/httprouter"
)

// GetCSRs returns a list of CertificateSigningRequests.
// GET /api/res/v1/csrs
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

// PatchCSRApproval updates the condition of the specific CertificateSigningRequest as "Approved" or "Denied".
// PATCH /api/res/v1/csrs/{csr}
func (e *Endpoints) PatchCSRApproval(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	c := e.Client

	// Parse parameters
	csrName := ps.ByName("csr")
	if csrName == "" {
		ihttp.ResponseError(w, 404, "CertificateSigningRequest not found.")
		return
	}

	// Unpacking JSON body data
	if r.Header.Get("Content-Type") != "application/json" {
		ihttp.ResponseError(w, 400, "Only JSON data allowed.")
		return
	}
	var req models.PatchCSRApprovalReq
	var err error
	jsonBody := make([]byte, r.ContentLength)
	r.Body.Read(jsonBody)
	err = json.Unmarshal(jsonBody, &req)
	if err != nil {
		ihttp.ResponseError(w, 500, err.Error())
		return
	}

	// Update the CSR
	var result string
	switch req.Condition {
	case "Approved":
		result, err = c.PatchCSRApproval(ik8s.ApproveCSR, csrName, req.Reason, req.Message)
	case "Denied":
		result, err = c.PatchCSRApproval(ik8s.DenyCSR, csrName, req.Reason, req.Message)
	default:
		ihttp.ResponseError(w, 400, "Invalid Condition.")
		return
	}
	if err != nil {
		ihttp.ResponseError(w, 500, err.Error())
		return
	}

	// Making Response
	resp := models.PatchCSRApprovalResp{
		ChangedCondition: result,
	}
	ihttp.ResponseOK(w, "success", resp)
	return
}
