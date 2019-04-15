export type HttpBodyMethods = "POST" | "PUT" | "PATCH" | "DELETE";

const flatHeader = (header: any) => [...header].reduce((acc, el) => ({ ...acc, [el[0]]: el[1] }), {});

const isEmpty = (object: object | string | undefined | any) => {
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
};

const getUserAgent = (name = "Mozilla FireFrogs") => {
	if (window.navigator) {
		return window.navigator.userAgent;
	}
	return name;
};

const headersDefault = new Headers({
	Accept: "application/json, text/plain,",
	"Content-Type": "application/json",
	"User-Agent": getUserAgent("Mozilla FireFrogs"),
	"X-Requested-With": "XMLHttpRequest",
});

const fetchConfig = {
	method: "GET",
	mode: "cors",
	cache: "no-cache",
	credentials: "same-origin",
	redirect: "follow",
	referrer: "no-referrer",
};

export default class HttpClient {
	public readonly config: any;
	public readonly headers: Headers;

	constructor() {
		this.config = { ...fetchConfig };
		this.headers = headersDefault;
	}

	public static async configResponseObject(request: any) {
		const payload = {
			data: await request.json(),
			url: request.url,
			status: request.status,
			headers: flatHeader(request.headers),
			statusText: request.statusText,
		};
		return request.ok ? Promise.resolve(payload) : Promise.reject(payload);
	}

	public static getUserAgent(name: string) {
		return getUserAgent(name);
	}

	public async requestMaybeBody(url: string, data: unknown, method: HttpBodyMethods) {
		if (data || isEmpty(data)) {
			const requestEmpty = fetch(url, HttpClient.configureFetchData(this.config, method, data));
			return HttpClient.configResponseObject(requestEmpty);
		}
		const request = await fetch(url, HttpClient.configureFetch(this.config, method));
		return HttpClient.configResponseObject(request);
	}

	public static configureFetch(defaults: any, method: string) {
		const config = { ...defaults };
		if (defaults) {
			if (defaults.headers) {
				config.headers = { ...defaults.headers };
			} else {
				config.headers = flatHeader(headersDefault);
			}
		}
		return { ...config, method };
	}

	public static configureFetchData(defaults: any, method: any, data: any) {
		const config = { ...defaults };
		if (defaults) {
			if (defaults.headers) {
				config.headers = { ...defaults.headers };
			} else {
				config.headers = flatHeader(headersDefault);
			}
		}
		return { ...config, method, body: JSON.stringify(data) };
	}

	public setAuthorization(token: string, key = "Authorization") {
		if (!this.headers.has(key)) {
			this.headers.append(key, token);
		}
		return this;
	}

	public setHeaderValue(key: string, token: string) {
		this.headers.append(key, token);
		return this;
	}

	public getConfig() {
		return { ...this.config, headers: flatHeader(this.headers) };
	}

	public async get(url: string) {
		const request = await fetch(url, HttpClient.configureFetch(this.config, "GET"));
		return HttpClient.configResponseObject(request);
	}

	public async put(url: string, data: unknown) {
		return this.requestMaybeBody(url, data, "PUT");
	}

	public async delete(url: string, data: unknown) {
		return this.requestMaybeBody(url, data, "DELETE");
	}

	public async patch(url: string, data: unknown) {
		return this.requestMaybeBody(url, data, "PATCH");
	}

	public async post(url: string, data: unknown) {
		const request = await fetch(url, HttpClient.configureFetchData(this.config, "POST", data));
		return HttpClient.configResponseObject(request);
	}
}
