import assert from "node:assert/strict";
import { clamp, toQueryString } from "../dist/index.js";

assert.equal(clamp(0, 10, 5), 5);
assert.equal(toQueryString({ page: 2 }), "utf8=%E2%9C%93&page=2");
