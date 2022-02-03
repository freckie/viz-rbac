package k8s

import (
	"fmt"
	"regexp"
	"strings"

	ijp "github.com/freckie/viz-rbac/internal/jsonpath"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

var (
	jpfmtForRoleBindings string = "{range .items[?(@.subjects[0].name==\"%s\")]}[{.roleRef.kind},{.roleRef.name}]{end}"
	rolePattern                 = regexp.MustCompile(`((Cluster)?Role),[0-9a-zA-Z-]+`)
)

type RoleResult struct {
	Kind string `json:"kind"`
	Name string `json:"name"`
}

// GetRolesByServiceAccount returns a list of Roles|ClusterRoles bound to a specific ServiceAccount.
func (c *K8SClient) GetRolesByServiceAccount(namespace, serviceAccount string) ([]RoleResult, error) {
	cs := c.clientset
	var result []RoleResult

	// Using jsonpath
	_jpStr := fmt.Sprintf(jpfmtForRoleBindings, serviceAccount)
	jp, err := ijp.NewJsonpathHandler("jsonPathForFindingRoleBindings", _jpStr)
	if err != nil {
		return result, err
	}
	jpResults := make([]string, 2)

	// Querying RoleBindings
	rbList, err := cs.RbacV1().RoleBindings(namespace).List(c.ctx, metav1.ListOptions{})
	if err != nil {
		return result, err
	}
	jpResults[0], err = jp.Execute(rbList)
	if err != nil {
		return result, err
	}

	// Querying ClusterRoleBindings
	crbList, err := cs.RbacV1().ClusterRoleBindings().List(c.ctx, metav1.ListOptions{})
	if err != nil {
		return result, err
	}
	jpResults[1], err = jp.Execute(crbList)
	if err != nil {
		return result, err
	}

	// Parsing the result of jsonpath execution
	jpResult := strings.Join(jpResults, "")
	result = make([]RoleResult, 0)
	for _, role := range rolePattern.FindAllString(jpResult, -1) {
		_tokens := strings.Split(role, ",")
		result = append(result, RoleResult{
			Kind: _tokens[0],
			Name: _tokens[1],
		})
	}

	return result, nil
}

type RoleRules map[string][]string

// GetRole returns result from describing a specific Role.
func (c *K8SClient) GetRole(namespace, roleName string) (RoleRules, error) {
	cs := c.clientset
	result := make(map[string][]string)

	role, err := cs.RbacV1().Roles(namespace).Get(c.ctx, roleName, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}

	for _, rule := range role.Rules {
		for _, res := range rule.Resources {
			result[res] = rule.Verbs
		}
	}

	return result, nil
}

// GetClusterRole returns result from describing a specific ClusterRole.
func (c *K8SClient) GetClusterRole(croleName string) (RoleRules, error) {
	cs := c.clientset
	result := make(map[string][]string)

	crole, err := cs.RbacV1().ClusterRoles().Get(c.ctx, croleName, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}

	for _, rule := range crole.Rules {
		for _, res := range rule.Resources {
			result[res] = rule.Verbs
		}
	}

	return result, nil
}
