package jsonpath

import (
	"bytes"

	jp "k8s.io/client-go/util/jsonpath"
)

func Execute(name, format string, data interface{}) (string, error) {
	handler := jp.New(name)
	err := handler.Parse(format)
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	err = handler.Execute(&buf, data)
	if err != nil {
		return "", err
	}

	return buf.String(), nil
}
