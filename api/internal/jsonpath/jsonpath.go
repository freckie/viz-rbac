package jsonpath

import (
	"bytes"

	jp "k8s.io/client-go/util/jsonpath"
)

type JsonpathHandler struct {
	JSONPath *jp.JSONPath
	JPFormat string
}

func NewJsonpathHandler(name, format string) (*JsonpathHandler, error) {
	handler := &JsonpathHandler{
		JPFormat: format,
	}

	handler.JSONPath = jp.New(name)
	err := handler.JSONPath.Parse(format)
	if err != nil {
		return nil, err
	}

	return handler, nil
}

func (h *JsonpathHandler) Execute(data interface{}) (string, error) {
	var buf bytes.Buffer
	err := h.JSONPath.Execute(&buf, data)
	if err != nil {
		return "", err
	}

	return buf.String(), nil
}
