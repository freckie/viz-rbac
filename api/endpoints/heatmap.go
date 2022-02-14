package endpoints

import (
	"net/http"

	ihttp "github.com/freckie/viz-rbac/internal/http"
	ik8s "github.com/freckie/viz-rbac/internal/k8s"
	"github.com/freckie/viz-rbac/models"

	"github.com/julienschmidt/httprouter"
)

// GetHeatmapSARes returns json data for SA-Res Heatmap
// GET /api/agg/v1/heatmap/sa-res/{namespace}
func (e *Endpoints) GetHeatmapSARes(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	c := e.Client

	// Parse parameters
	namespace := ps.ByName("namespaces")
	if namespace == "" {
		ihttp.ResponseError(w, 404, "Namespace not found.")
		return
	}

	// Get ServiceAccounts
	saList, err := c.GetServiceAccounts(namespace)
	if err != nil {
		ihttp.ResponseError(w, 500, err.Error())
		return
	}

	// Get resources and verbs
	resp := make(models.GetHeatmapSAResResp)
	for _, sa := range saList {
		roles, err := c.GetRolesByServiceAccount(namespace, sa.Name)
		if err != nil {
			continue
		}

		// Parse Rules
		for _, role := range roles {
			var rules ik8s.RoleRules

			switch role.Kind {
			case "Role":
				rules, _ = c.GetRole(namespace, role.Name)
			case "ClusterRole":
				rules, _ = c.GetClusterRole(role.Name)
			}

			resp[sa.Name] = rules
		}
	}

	// Make response
	ihttp.ResponseOK(w, "success", resp)
	return
}
