package k8s

import (
	"context"

	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

type K8SClient struct {
	ctx       context.Context
	clientset *kubernetes.Clientset
}

func LoadK8S() (K8SClient, error) {
	var client K8SClient

	config, err := rest.InClusterConfig()
	if err != nil {
		return client, err
	}

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return client, err
	}

	client = K8SClient{
		ctx:       context.Background(),
		clientset: clientset,
	}

	return client, nil
}
