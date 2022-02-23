package endpoints

import (
	"net/http"

	ihttp "github.com/freckie/viz-rbac/internal/http"

	"github.com/julienschmidt/httprouter"
)

// GetHeatmapSARes returns json data for SA-Res Heatmap
// GET /api/agg/v1/heatmap/sa-res/{namespace}
func (e *Endpoints) GetHeatmapSARes(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	c := e.Client

	// Parse parameters
	namespace := ps.ByName("namespace")
	if namespace == "" {
		ihttp.ResponseError(w, 404, "Namespace not found.")
		return
	}

	resp, err := c.GetHeatmapSAResData(namespace)
	if err != nil {
		ihttp.ResponseError(w, 500, err.Error())
		return
	}

	// Make response
	ihttp.ResponseOK(w, "success", resp)
	return
}

// GetHeatmapUserNS returns json data for User-NS Heatmap
// GET /api/agg/v1/heatmap/user-ns
func (e *Endpoints) GetHeatmapUserNS(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	c := e.Client

	resp, err := c.GetHeatmapUserNSData()
	if err != nil {
		ihttp.ResponseError(w, 500, err.Error())
		return
	}

	// Make response
	ihttp.ResponseOK(w, "success", resp)
	return
}
