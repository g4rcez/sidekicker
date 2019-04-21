import { trueTrim } from "../strings/Utils";

export function noHtml(dom: string) {
	return trueTrim(dom.replace(/<[^>]*>/g, ""));
}
