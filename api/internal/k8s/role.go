package k8s

import (
	"bytes"
	"fmt"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/util/jsonpath"
)

var (
	jpfmtForRoleBindings string = "{range .items[?(@.subjects[0].name==\"%s\")]}[{.roleRef.kind},{.roleRef.name}]{end}"
)

// GetRolesByServiceAccount returns a list of Roles bound to a specific ServiceAccount.
func (c *K8SClient) GetRolesByServiceAccount(namespace, serviceAccount string) (string, error) {
	cs := c.clientset
	var result string

	// Using jsonpath
	jp := jsonpath.New("jsonPathForFindingRoleBindings")
	jp.EnableJSONOutput(true)
	_jpStr := fmt.Sprintf(jpfmtForRoleBindings, serviceAccount)
	err := jp.Parse(_jpStr)
	if err != nil {
		return result, err
	}

	// 추후 다음 커맨드처럼 수정
	// kubectl get rolebinding,clusterrolebinding --all-namespaces -o jsonpath='{range .items[?(@.subjects[0].name=="SERVICE_ACCOUNT_NAME")]}[{.roleRef.kind},{.roleRef.name}]{end}'
	rbList, err := cs.RbacV1().RoleBindings(namespace).List(c.ctx, metav1.ListOptions{})
	if err != nil {
		return result, err
	}

	// Jsonpath execution
	var buf bytes.Buffer
	jp.Execute(&buf, rbList)
	return buf.String(), nil

	// List up names of Roles that are referenced by RoleBindings
	// for _, rb := range rbList.Items {
	// 	for _, sbj := range rb.Subjects {
	// 		if sbj.Name == serviceAccount {
	// 			result = append(result, rb.RoleRef.Name)
	// 			break
	// 		}
	// 	}
	// }

	// return result, nil
}
