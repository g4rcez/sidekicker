export * from "./Format";
export * from "./unix/Cut";
export * from "./unix/Tr";
export * from "./Url";
export * from "./Utils";
export { url } from "./Url";
export { format } from "./Format";
export { utils } from "./Utils";

export function isNullString(string?: string) {
	return string !== null || string !== undefined;
}
