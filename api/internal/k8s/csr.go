package k8s

import (
	"context"

	certv1 "k8s.io/api/certificates/v1"
	corev1 "k8s.io/api/core/v1"
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

type CSRApprovalType string

const (
	ApproveCSR CSRApprovalType = "Approve"
	DenyCSR    CSRApprovalType = "Deny"
)

func (c *K8SClient) PatchCSRApproval(csrType CSRApprovalType, csrName, reason, message string) (string, error) {
	cs := c.clientset

	var condType certv1.RequestConditionType
	if csrType == ApproveCSR {
		condType = certv1.CertificateApproved
	} else {
		condType = certv1.CertificateDenied
	}

	// Get existing CSR
	csr, err := cs.CertificatesV1().CertificateSigningRequests().Get(context.TODO(), csrName, metav1.GetOptions{})
	if err != nil {
		return "", err
	}

	// Request to update the CSR
	csr.Status.Conditions = append(csr.Status.Conditions, certv1.CertificateSigningRequestCondition{
		Type:           condType,
		Status:         corev1.ConditionTrue,
		Reason:         reason,
		Message:        message,
		LastUpdateTime: metav1.Now(),
	})
	resp, err := cs.CertificatesV1().CertificateSigningRequests().UpdateApproval(
		context.TODO(),
		csrName,
		csr,
		metav1.UpdateOptions{},
	)
	if err != nil {
		return "", err
	}

	return string((*resp).Status.Conditions[0].Type), nil
}
