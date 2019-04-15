export function isEmpty(object: unknown | any) {
	if (typeof object === "undefined") {
		return true;
	}
	if (object === null || object === {} || object === []) {
		return true;
	}
	if (object === "") {
		return true;
	}
	for (const key in object) {
		if (object.hasOwnProperty(key)) {
			return false;
		}
	}
	return true;
}
