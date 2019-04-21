// Regex reference: https://gist.github.com/dperini/729294
import { flat } from "../iterable";
import { isEmpty } from "../comparable";

export type UrlValidation = {
	domain?: string;
	protocols?: string[];
	routesOrder?: string[];
	maxRoutes?: number;
};

function concatProtocols(some: string[]) {
	return flat(some).join("|");
}

const domainRegex = new RegExp(
	"(?:" +
		// IP address dotted notation octets
		// excludes loopback network 0.0.0.0
		// excludes reserved space >= 224.0.0.0
		// excludes network & broacast addresses
		// (first & last IP address of each class)
		"(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
		"(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
		"(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
		"|" +
		// host & domain names, may end with dot: use shortest alternative
		"(?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+" +
		// this is the longest alternative
		// "(?:" +
		// "(?:" +
		// "[a-z0-9\\u00a1-\\uffff]" +
		// "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
		// ")?" +
		// "[a-z0-9\\u00a1-\\uffff]\\." +
		// ")+" +
		// TLD identifier name, may end with dot
		"(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
		// End domain block
		")",
	"i",
);

function getUrlRegex(protocols: string) {
	return new RegExp(
		// tslint:disable-next-line: prefer-template
		"^" +
			// protocol identifier (optional)
			// short syntax // still required
			`(?:(?:(?:${protocols}):)?\\/\\/)?` +
			// user:pass BasicAuth (optional)
			"(?:\\S+(?::\\S*)?@)?" +
			domainRegex.source +
			// port number (optional)
			"(?::\\d{2,5})?" +
			// resource path (optional)
			"(?:[/?#]\\S*)?" +
			"$",
		"i",
	);
}

// Define the default protocol accepteds, https with '?' accept http too
const acceptedProtocols = ["https?", "ftp"];

function validateDomain(url: string, domain: string, validate: boolean) {
	if (validate) {
		return !!url.match(domainRegex)[0].match(domain);
	}
	return true;
}

const splitUrlParams = (url: string) => {
	return url.split("//")[1].split("/");
};

function countRoutes(url: string, max: number) {
	return splitUrlParams(url).length <= max;
}

function getSafeProtocols(protocols?: string[]) {
	if (isEmpty(protocols)) {
		return acceptedProtocols;
	}
	return [...acceptedProtocols, ...protocols];
}

export function isUrl(url: string, props?: UrlValidation) {
	const protocols = getSafeProtocols(props.protocols);
	const domain = props ? props.domain : "";
	const max = props ? props.maxRoutes : Number.MAX_SAFE_INTEGER;
	const regex = getUrlRegex(concatProtocols([...acceptedProtocols, ...protocols]));
	const isUrlMatch = !!url.match(regex);
	return isUrlMatch && validateDomain(url, domain, domain !== "") && countRoutes(url, max);
}
