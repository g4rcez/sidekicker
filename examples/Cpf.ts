import { isCpf } from "../lib";

["234.055.884-05", "", "608.788.297-92"].forEach((x) => {
    console.log(x, isCpf(x, { states: ["RJ"] }));
});
