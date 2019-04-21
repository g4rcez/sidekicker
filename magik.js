const fs = require("fs");
const argv = process.argv.splice(1);

const { exec } = require("child_process");

const shell = (command) =>
	new Promise((res, rej) =>
		exec(command, (err, stdout, stderr) => {
			if (err) {
				return rej([false, stderr]);
			}
			return res([true, stdout]);
		}),
	);

const read = (file) =>
	new Promise((res, rej) => fs.readFile(file, "utf8", (err, content) => (err ? rej(err) : res(content))));

const write = (file, content) =>
	new Promise((res, rej) =>
		fs.writeFile(file, JSON.stringify(content, null, 4), (err) => {
			return err ? rej([false, err]) : res(true);
		}),
	);

const message = argv[0];
console.log("ARGS", argv);
const versionInc = argv[1] || "beta";

const calculateVersion = (increment, versions = ["0", "0", "0"]) => {
	const last = Number.parseInt(versions[2], 10) + 1;
	if (increment === "beta") {
		return `${versions[0]}.${versions[1]}.${last}`;
	}
	const pre = Number.parseInt(versions[1], 10) + 1;
	if (increment === "preRelease") {
		return `${versions[0]}.${pre}.${last}`;
	}
	const release = Number.parseInt(versions[0], 10) + 1;
	return `${release}.${pre}.${last}`;
};

const gitAdd = async () => {
	const cmd = await shell("git add .");
	console.log("Adicionando arquivos", cmd[1]);
};

const gitCommit = async (version) => {
	await shell(`git commit -m "${message || version}"`);
	console.log("Increment to version: ", version, message);
};

const gitTag = async (version) => {
	const tag = await shell(`git tag v${version}`);
	console.log(`Create tag: v${version}`, tag[1]);
};

const gitPush = async (version) => {
	const push = await shell(`git push origin v${version}`);
	console.log("Push tag", push[1]);
};

read("./package.json")
	.then((json) => {
		const content = JSON.parse(json);
		const version = calculateVersion(versionInc, content.version.split("."));
		write("./package.json", { ...content, version })
			.then(async (e) => {
				try {
					await gitAdd();
					await gitCommit(version);
					await gitTag(version);
					await gitPush(version);
				} catch (e) {
					console.log(e);
				}
			})
			.catch((e) => console.log(e));
	})
	.catch((e) => console.log(e));
