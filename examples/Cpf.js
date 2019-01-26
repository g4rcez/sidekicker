const { isCpf } = require("../lib/validations");

["234.055.884-05", "", "608.788.297-92"].forEach((x) => {
    console.log(x, isCpf(x, { states: ["RJ"] }));
});
