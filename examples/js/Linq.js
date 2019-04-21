const LINQ = require("../../lib/linq").default;

const data = [
	{
		nome: "Fulano",
		idade: 21,
		birthDate: "21/09/1990",
		skills: ["JS", "C#"],
	},
	{
		nome: "Beltrano",
		idade: 30,
		birthDate: "12/02/1990",
		skills: ["Java", "Clojure"],
	},
];

const linq = LINQ(data);
console.log(linq.where("skills", "equals", ["Java", "Clojure"]).select());
console.log(linq.where("birthDate", "between", ["DD/MM/YYYY", "12/02/1989", "12/02/2000"]).select());
