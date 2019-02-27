import { Linq } from "../lib";

const list = Linq<{ id: number; value: number }>([
	{ id: 1, value: 10 },
	{ id: 2, value: 20 },
	{ id: 3, value: 30 },
	{ id: 4, value: 40 },
	{ id: 5, value: 50 },
	{ id: 6, value: 50 },
	{ id: 7, value: 60 },
	{ id: 8, value: 70 },
])
	.where("value", "===", 50)
	.uniqBy("id")
	.reverse()
	.orderBy("value");
console.log(list.select());
console.log(list.sum("value"));
