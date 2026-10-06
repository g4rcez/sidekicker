import assert from "node:assert/strict";
import {
    equals,
    Linq,
    camelCase,
    chunk,
    dict,
    distinct,
    formToJson,
    merge,
    getPath,
    joinPathname,
    kebabCase,
    omit,
    partition,
    pick,
    pipe,
    raise,
    retry,
    setPath,
    snakeCase,
    tryCatch,
} from "../dist/index.js";

const people = [
    { id: 1, name: "Ada", teamId: 10, score: 98 },
    { id: 2, name: "Grace", teamId: 20, score: 95 },
    { id: 3, name: "Alan", teamId: 10, score: 91 },
    { id: 4, name: "Katherine", teamId: 30, score: 88 },
];

// Sequence operators are deferred until a terminal operator enumerates the query.
const honorRoll = new Linq(people)
    .Where((person) => person.score >= 90)
    .Select((person) => person.name)
    .ToArray();
assert.deepEqual(honorRoll, ["Ada", "Grace", "Alan"]);
console.log("Honor roll:", honorRoll);

const teamCounts = new Linq(people)
    .GroupBy("teamId")
    .Select((group) => ({ teamId: group.Key, count: group.Count }))
    .ToArray();
assert.deepEqual(teamCounts, [
    { teamId: 10, count: 2 },
    { teamId: 20, count: 1 },
    { teamId: 30, count: 1 },
]);
console.log("Counts by team:", teamCounts);

const teams = [
    { id: 10, name: "Research" },
    { id: 20, name: "Engineering" },
    { id: 30, name: "Analysis" },
];
const assignments = new Linq(teams)
    .Join(people, "id", "teamId", (team, person) => `${team.name}: ${person.name}`)
    .ToArray();
assert.deepEqual(assignments, ["Research: Ada", "Research: Alan", "Engineering: Grace", "Analysis: Katherine"]);
console.log("Team members:", assignments);
const [topPeople, otherPeople] = new Linq(people).Partition((person) => person.score >= 90);
assert.equal(topPeople.length, 3);
assert.equal(otherPeople.length, 1);
const [evens, odds] = partition([1, 2, 3, 4], (value) => value % 2 === 0);
assert.deepEqual(evens, [2, 4]);
assert.deepEqual(odds, [1, 3]);

const squares = Linq.Range(1, 5)
    .Select((number) => number ** 2)
    .ToArray();
assert.deepEqual(squares, [1, 4, 9, 16, 25]);

const batches = chunk([1, 2, 3, 4, 5], 2);
const uniqueValues = distinct([1, 1, 2, 3, 2]);
const peopleById = dict(people, "id");
assert.deepEqual(batches, [[1, 2], [3, 4], [5]]);
assert.deepEqual(uniqueValues, [1, 2, 3]);
assert.equal(peopleById["2"].name, "Grace");
console.log("Array helpers:", { batches, uniqueValues, secondPerson: peopleById["2"].name });
assert.deepEqual(pick(people[0], ["id", "name"]), { id: 1, name: "Ada" });
assert.deepEqual(omit(people[0], ["score"]), { id: 1, name: "Ada", teamId: 10 });
assert.equal(camelCase("XMLHttpRequest"), "xmlHttpRequest");
assert.equal(snakeCase("XMLHttpRequest"), "xml_http_request");
assert.equal(kebabCase("hello_world"), "hello-world");
const combined = merge({ profile: { name: "Ada", active: true } }, { profile: { name: "Grace" } });
assert.deepEqual(combined, { profile: { name: "Grace", active: true } });
assert.equal(equals(combined, { profile: { name: "Grace", active: true } }), true);

const describeScore = pipe(
    (score) => score + 5,
    (score) => `Score: ${score * 2}`,
);
assert.equal(describeScore(10), "Score: 30");
console.log("Composed function:", describeScore(10));

const original = { profile: { name: "Ada" } };
const updated = setPath(original, "profile.name", "Grace");
assert.equal(getPath(original, "profile.name"), "Ada");
assert.equal(getPath(updated, "profile.name"), "Grace");
assert.equal(joinPathname("https://example.test/api///", "/users/", "/42"), "https://example.test/api/users/42");
console.log("Object and URL helpers:", {
    originalName: getPath(original, "profile.name"),
    updatedName: getPath(updated, "profile.name"),
    userUrl: joinPathname("https://example.test/api///", "/users/", "/42"),
});
const formData = new FormData();
formData.append("profile.name", "Ada");
assert.equal(getPath(formToJson(formData), "profile.name"), "Ada");

const parseJson = tryCatch(
    (source) => JSON.parse(source),
    raise(SyntaxError, (error) => error.message),
);
const validJson = parseJson('{"active":true}');
const invalidJson = parseJson("{");
assert.equal(validJson.isSuccess(), true);
assert.deepEqual(validJson.success, { active: true });
assert.equal(invalidJson.isError(), true);
assert.equal(typeof invalidJson.error, "string");
console.log("tryCatch:", { valid: validJson.success, invalid: invalidJson.error });
let operationCalls = 0;
const retried = await retry(
    (_signal, attempt) => {
        operationCalls++;
        if (attempt === 1) throw new Error("temporary failure");
        return "ready";
    },
    { retries: 1 },
);
assert.equal(retried, "ready");
assert.equal(operationCalls, 2);

console.log("All examples passed.");
