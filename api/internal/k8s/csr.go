package k8s

import (
	"context"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type CSRResult struct {
	Name       string `json:"name"`
	SignerName string `json:"signer_name"`
	Status     string `json:"status"`
	Username   string `json:"username"`
}

func (c *K8SClient) GetCSRs() ([]CSRResult, error) {
	cs := c.clientset
	result := make([]CSRResult, 0)

	// Querying CSRs
	csrList, err := cs.CertificatesV1().CertificateSigningRequests().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return result, err
	}

	for _, csr := range csrList.Items {
		var status string
		if len(csr.Status.Conditions) == 0 {
			status = "Pending"
		} else {
			status = string(csr.Status.Conditions[0].Type)
		}

		result = append(result, CSRResult{
			Name:       csr.Name,
			SignerName: csr.Spec.SignerName,
			Status:     status,
			Username:   csr.Spec.Username,
		})
	}

	return result, nil
}
