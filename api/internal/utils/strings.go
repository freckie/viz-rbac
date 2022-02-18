package utils

func ContainsString(slice []string, target string) bool {
	for idx := range slice {
		if target == slice[idx] {
			return true
		}
	}
	return false
}

func ConcatString(left, right []string) []string {
	temp := make(map[string]bool)
	result := make([]string, 0)
	for _, it := range left {
		temp[it] = true
		result = append(result, it)
	}
	for _, it := range right {
		if !temp[it] {
			result = append(result, it)
		}
	}
	return result
}
