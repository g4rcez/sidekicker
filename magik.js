const fs = require("fs");
const argv = process.argv.splice(0, 1);
const { exec } = require("child_process");

const shell = (command) => {
	return new Promise((res, rej) => {
		exec(command, (err, stdout, stderr) => {
			if (err) {
				return rej([false, stderr]);
			}
			return res([true, stdout]);
		});
	});
};

const read = (file) =>
	new Promise((res, rej) => fs.readFile(file, "utf8", (err, content) => (err ? rej(err) : res(content))));

const write = (file, content) => {
	return new Promise((res, rej) => {
		return fs.writeFile(file, JSON.stringify(content, null, 4), (err) => {
			return err ? rej([false, err]) : res(true);
		});
	});
};

const message = argv[0];
const versionInc = argv[1] || "beta";

const calculateVersion = (increment, versions = ["0", "0", "0"]) => {
	const release = Number.parseInt(versions[0], 10) + 1;
	const pre = Number.parseInt(versions[1], 10) + 1;
	const last = Number.parseInt(versions[2], 10) + 1;
	if (increment === "beta") {
		return `${versions[0]}.${versions[1]}.${last}`;
	} else if (increment === "preRelease") {
		return `${versions[0]}.${pre}.${last}`;
	}
	return `${release}.${pre}.${last}`;
};

read("./package.json")
	.then((json) => {
		const content = JSON.parse(json);
		const version = calculateVersion(versionInc, content.version.split("."));
		write("./package.json", { ...content, version })
			.then(async (e) => {
				try {
					const cmd = await shell("git add .");
					console.log("Adicionando arquivos", cmd[1]);
					await shell(`git commit -m "${message || version}"`);
					console.log("Increment to version: ", version);
					const tag = await shell(`git tag v${version}`);
					console.log(`"Create tag: v${version}`, tag);
				} catch (error) {
					console.log(error);
				}
			})
			.catch((e) => console.log("Deu ruim no write"));
	})
	.catch((e) => console.log("Deu ruim", e));
