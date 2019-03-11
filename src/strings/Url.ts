export function urlOnlyParameters(urlString: string) {
	const matches = urlString.match(/[^&?]*?=[^&?]*/g);
	if (!!matches) {
		return matches;
	}
	return [];
}

export function splitUrlValues(param: string): string[] {
	return param.split("=");
}

export function getUrlParameters(urlString: string) {
	return urlString.split("&");
}

export function parameterKeyAndValue(parameter: string): string[][] {
	return getUrlParameters(parameter).map(splitUrlValues);
}

export function urlParameters(urlString: string) {
	return urlOnlyParameters(urlString)
		.map((parameter) => new Set(parameterKeyAndValue(parameter)))
		.reduce((acc, el) => {
			const [name, value] = el.values().next().value;
			try {
				return { ...acc, [name]: JSON.parse(value) };
			} catch (error) {
				return { ...acc, [name]: value };
			}
		}, {});
}

export function urlProtocol(urlString = "") {
	return urlString.split("://")[0];
}

export const url = {
	getUrlParameters,
	splitUrlValues,
	urlOnlyParameters,
	urlParameters,
	urlProtocol,
};
