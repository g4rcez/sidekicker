export function ValidateArray(arr: any[]) {
	if (Array.isArray(arr)) {
		return arr;
	}
	return [];
}
