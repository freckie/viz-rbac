package k8s

import (
	"context"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	istrings "github.com/freckie/viz-rbac/internal/strings"
)

func (c *K8SClient) GetHeatmapSAResData(namespace string) (map[string]RoleRules, error) {
	cs := c.clientset
	result := make(map[string]RoleRules)

	// Get all ServiceAccounts
	saList, err := cs.CoreV1().ServiceAccounts(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return result, err
	}
	saNames := make([]string, len(saList.Items))
	for idx, sa := range saList.Items {
		saNames[idx] = sa.Name
		result[sa.Name] = make(RoleRules)
	}

	// Iterate all RoleBindings
	rbList, err := cs.RbacV1().RoleBindings(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return result, err
	}
	for _, rb := range rbList.Items {
		if len(rb.Subjects) == 0 {
			continue
		}
		if rb.Subjects[0].Kind != "ServiceAccount" {
			continue
		}

		saName := rb.Subjects[0].Name
		if !(istrings.Contains(saNames, saName)) {
			continue
		}

		role, _ := c.GetRole(namespace, rb.RoleRef.Name)
		for res, verbs := range role {
			if result[saName][res] == nil {
				result[saName][res] = verbs
			} else {
				result[saName][res] = istrings.Concat(result[saName][res], verbs)
			}
		}
	}

	// Iterate all ClusterRoleBindings
	crbList, err := cs.RbacV1().ClusterRoleBindings().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return result, err
	}
	for _, crb := range crbList.Items {
		if len(crb.Subjects) == 0 {
			continue
		}
		if crb.Subjects[0].Kind != "ServiceAccount" {
			continue
		}

		saName := crb.Subjects[0].Name
		if !(istrings.Contains(saNames, saName)) {
			continue
		}
		if result[saName] == nil {
			result[saName] = make(RoleRules)
		}

		role, _ := c.GetClusterRole(crb.RoleRef.Name)
		for res, verbs := range role {
			if result[saName][res] == nil {
				result[saName][res] = verbs
			} else {
				result[saName][res] = istrings.Concat(result[saName][res], verbs)
			}
		}
	}

	return result, nil
}

func (c *K8SClient) GetHeatmapUserNSData() (map[string]map[string]int, error) {
	cs := c.clientset
	result := make(map[string]map[string]int)

	// Iterate all RoleBindings
	rbList, err := cs.RbacV1().RoleBindings("").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return result, err
	}
	for _, rb := range rbList.Items {
		if (len(rb.Subjects) == 0) || (rb.Subjects[0].Kind != "User") {
			continue
		}

		user := rb.Subjects[0].Name
		if result[user] == nil {
			result[user] = make(map[string]int)
		}

		namespace := rb.Namespace
		result[user][namespace] += 1
	}

	// Iterate all ClusterRoleBindings
	crbList, err := cs.RbacV1().ClusterRoleBindings().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return result, err
	}
	for _, crb := range crbList.Items {
		if len(crb.Subjects) == 0 {
			continue
		}
		if crb.Subjects[0].Kind != "User" {
			continue
		}

		user := crb.Subjects[0].Name
		if result[user] == nil {
			result[user] = make(map[string]int)
		}

		result[user]["_cluster"] += 1
	}

	return result, nil
}

func (c *K8SClient) GetHeatmapUserResData(namespace string) (map[string]RoleRules, error) {
	cs := c.clientset
	result := make(map[string]RoleRules)

	// Iterate all RoleBindings
	rbList, err := cs.RbacV1().RoleBindings(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return result, err
	}
	for _, rb := range rbList.Items {
		if len(rb.Subjects) == 0 {
			continue
		}
		if rb.Subjects[0].Kind != "User" {
			continue
		}

		user := rb.Subjects[0].Name
		if result[user] == nil {
			result[user] = make(RoleRules)
		}

		role, _ := c.GetRole(namespace, rb.RoleRef.Name)
		for res, verbs := range role {
			if result[user][res] == nil {
				result[user][res] = verbs
			} else {
				result[user][res] = istrings.Concat(result[user][res], verbs)
			}
		}
	}

	// Iterate all ClusterRoleBindings
	crbList, err := cs.RbacV1().ClusterRoleBindings().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return result, err
	}
	for _, crb := range crbList.Items {
		if len(crb.Subjects) == 0 {
			continue
		}
		if crb.Subjects[0].Kind != "User" {
			continue
		}

		user := crb.Subjects[0].Name
		if result[user] == nil {
			result[user] = make(RoleRules)
		}

		role, _ := c.GetClusterRole(crb.RoleRef.Name)
		for res, verbs := range role {
			if result[user][res] == nil {
				result[user][res] = verbs
			} else {
				result[user][res] = istrings.Concat(result[user][res], verbs)
			}
		}
	}

	return result, nil
}
