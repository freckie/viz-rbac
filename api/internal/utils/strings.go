package utils

func ContainsString(slice []string, target string) bool {
	for idx := range slice {
		if target == slice[idx] {
			return true
		}
	}
	return false
}
