package k8s

import (
	"context"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// GetNamespaces returns a list of existing namespaces in the cluster.
func (c *K8SClient) GetNamespaces() ([]string, error) {
	cs := c.clientset
	var result []string

	nsList, err := cs.CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return result, err
	}

	result = make([]string, len(nsList.Items))
	for idx, ns := range nsList.Items {
		result[idx] = ns.Name
	}

	return result, nil
}
