package k8s

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// GetRolesByServiceAccount returns a list of Roles bound to a specific ServiceAccount.
func (c *K8SClient) GetRolesByServiceAccount(serviceAccount string) ([]string, error) {
	cs := c.clientset
	var result []string

	sa, err := cs.CoreV1().ServiceAccounts("").Get(c.ctx, serviceAccount, metav1.GetOptions{})
	if err != nil {
		return result, err
	}
	ns := sa.Namespace

	// 추후 다음 커맨드처럼 수정
	// kubectl get rolebinding,clusterrolebinding --all-namespaces -o jsonpath='{range .items[?(@.subjects[0].name=="SERVICE_ACCOUNT_NAME")]}[{.roleRef.kind},{.roleRef.name}]{end}'
	rbList, err := cs.RbacV1().RoleBindings(ns).List(c.ctx, metav1.ListOptions{})
	if err != nil {
		return result, err
	}

	// List up names of Roles that are referenced by RoleBindings
	for _, rb := range rbList.Items {
		for _, sbj := range rb.Subjects {
			if sbj.Name == serviceAccount {
				result = append(result, rb.RoleRef.Name)
				break
			}
		}
	}

	return result, nil
}
