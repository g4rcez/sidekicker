interface ITR {
	text: string;
	subs1: string;
	subs2: string;
}

export const tr = (parameters: ITR) => {
	const text = [...parameters.text];
	if (parameters.subs1.length === parameters.subs2.length) {
		[...parameters.subs1].forEach((x, i) => {
			if (text.indexOf(x) !== parameters.text.search(x)) {
				text[text.indexOf(x)] = parameters.subs2[i];
			} else {
				text[parameters.text.search(x)] = parameters.subs2[i];
			}
		});
		return text.join("");
	}
	return parameters.text;
};
