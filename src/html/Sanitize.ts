import { trueTrim } from "../strings/Utils";

export function noHtml(string: string) {
	return trueTrim(string.replace(/<[^>]*>/g, ""));
}
