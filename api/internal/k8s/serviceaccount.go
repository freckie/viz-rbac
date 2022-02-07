package k8s

import (
	"context"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type ServiceAccountResult struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
}

// GetServiceAccounts returns a list of ServiceAccounts in a specific namespace.
// If you want to list ServiceAccounts among all namespaces, just set namespace as an empty string.
func (c *K8SClient) GetServiceAccounts(namespace string) ([]ServiceAccountResult, error) {
	cs := c.clientset
	var result []ServiceAccountResult

	saList, err := cs.CoreV1().ServiceAccounts(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return result, err
	}

	result = make([]ServiceAccountResult, len(saList.Items))
	for idx, sa := range saList.Items {
		result[idx] = ServiceAccountResult{
			Name:      sa.Name,
			Namespace: sa.Namespace,
		}
	}

	return result, nil
}
