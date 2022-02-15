package k8s

import (
	"context"

	iutils "github.com/freckie/viz-rbac/internal/utils"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

var (
	wildcardVerbs = []string{"get", "list", "watch", "update", "patch", "create", "delete", "deletecollection"}
)

type RoleResult struct {
	Kind string `json:"kind"`
	Name string `json:"name"`
}

// GetRolesByServiceAccount returns a list of Roles|ClusterRoles bound to a specific ServiceAccount.
func (c *K8SClient) GetRolesByServiceAccount(namespace, serviceAccount string) ([]RoleResult, error) {
	cs := c.clientset
	result := make([]RoleResult, 0)

	// Querying RoleBindings
	rbList, err := cs.RbacV1().RoleBindings(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return result, err
	}

	for _, rb := range rbList.Items {
		if (len(rb.Subjects) == 0) || (rb.Subjects[0].Kind != "ServiceAccount") {
			continue
		}
		if rb.Subjects[0].Name == serviceAccount {
			result = append(result, RoleResult{
				Kind: rb.RoleRef.Kind,
				Name: rb.RoleRef.Name,
			})
		}
	}

	// Querying ClusterRoleBindings
	crbList, err := cs.RbacV1().ClusterRoleBindings().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return result, err
	}

	for _, crb := range crbList.Items {
		if (len(crb.Subjects) == 0) || (crb.Subjects[0].Kind != "ServiceAccount") {
			continue
		}
		if crb.Subjects[0].Name == serviceAccount {
			result = append(result, RoleResult{
				Kind: crb.RoleRef.Kind,
				Name: crb.RoleRef.Name,
			})
		}
	}

	return result, nil
}

// GetRolesByUser returns a list of Roles|ClusterRoles bound to a specific User.
func (c *K8SClient) GetRolesByUser(username string) ([]RoleResult, error) {
	cs := c.clientset
	result := make([]RoleResult, 0)

	// Querying RoleBindings
	rbList, err := cs.RbacV1().RoleBindings("").List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return result, err
	}

	for _, rb := range rbList.Items {
		if (len(rb.Subjects) == 0) || (rb.Subjects[0].Kind != "User") {
			continue
		}
		if rb.Subjects[0].Name == username {
			result = append(result, RoleResult{
				Kind: rb.RoleRef.Kind,
				Name: rb.RoleRef.Name,
			})
		}
	}

	// Querying ClusterRoleBindings
	crbList, err := cs.RbacV1().ClusterRoleBindings().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		return result, err
	}

	for _, crb := range crbList.Items {
		if (len(crb.Subjects) == 0) || (crb.Subjects[0].Kind != "User") {
			continue
		}
		if crb.Subjects[0].Name == username {
			result = append(result, RoleResult{
				Kind: crb.RoleRef.Kind,
				Name: crb.RoleRef.Name,
			})
		}
	}

	return result, nil
}

type RoleRules map[string][]string

// GetRole returns result from describing a specific Role.
func (c *K8SClient) GetRole(namespace, roleName string) (RoleRules, error) {
	cs := c.clientset
	result := make(map[string][]string)

	role, err := cs.RbacV1().Roles(namespace).Get(context.TODO(), roleName, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}

	for _, rule := range role.Rules {
		for _, res := range rule.Resources {
			if iutils.ContainsString(rule.Verbs, "*") {
				result[res] = wildcardVerbs
			} else {
				result[res] = rule.Verbs
			}
		}
	}

	return result, nil
}

// GetClusterRole returns result from describing a specific ClusterRole.
func (c *K8SClient) GetClusterRole(croleName string) (RoleRules, error) {
	cs := c.clientset
	result := make(map[string][]string)

	crole, err := cs.RbacV1().ClusterRoles().Get(context.TODO(), croleName, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}

	for _, rule := range crole.Rules {
		for _, res := range rule.Resources {
			if iutils.ContainsString(rule.Verbs, "*") {
				result[res] = wildcardVerbs
			} else {
				result[res] = rule.Verbs
			}
		}
	}

	return result, nil
}
