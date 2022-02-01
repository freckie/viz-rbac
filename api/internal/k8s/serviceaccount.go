package k8s

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// GetServiceAccounts returns a list of ServiceAccounts in a specific namespace.
// If you want to list ServiceAccounts among all namespaces, just set namespace as an empty string.
func (c *K8SClient) GetServiceAccounts(namespace string) ([]string, error) {
	cs := c.clientset
	var result []string

	saList, err := cs.CoreV1().ServiceAccounts(namespace).List(c.ctx, metav1.ListOptions{})
	if err != nil {
		return result, err
	}

	result = make([]string, len(saList.Items))
	for idx, sa := range saList.Items {
		result[idx] = sa.Name
	}

	return result, nil
}
