const groupBy = (key: string) => (array: any[]) => {
	return array.reduce((accumulator, element) => {
		const name = element[key];
		return accumulator[name] ? [...accumulator[name], element] : { ...accumulator, [name]: [element] };
	}, {});
};

export default groupBy;
