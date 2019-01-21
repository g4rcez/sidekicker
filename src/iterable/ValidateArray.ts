export function ValidateArray(arr: any[]) {
    if (Array.isArray(arr)) {
        return arr.length === 0 ? [] : arr;
    }
    return [];
}
