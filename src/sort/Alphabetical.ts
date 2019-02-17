import * as Strings from "../comparable/Strings";

const insensitive = (a: string, b: string) => {
	if (Strings.strEquals(a, b)) {
		return 0;
	}
	return Strings.firstAlphabeticalOrderInsensitive(a, b) ? -1 : 1;
};

const sensitive = (a: string, b: string) => {
	if (Strings.strEquals(a, b)) {
		return 0;
	}
	return Strings.firstAlphabeticalOrderSensitive(a, b) ? -1 : 1;
};

export default { sensitive, insensitive };
