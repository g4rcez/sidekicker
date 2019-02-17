export async function TryCatch<L, R>(promisy: Promise<any>): Promise<L | R> {
	return promisy.then((result: R) => result).catch((error: L) => error);
}
