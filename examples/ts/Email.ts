import { isEmail } from "../../lib/validations";

["foo@bar.io", "git@github.com", "test.com", ""].forEach((x) => {
    console.log(x, isEmail(x, { domain: "github.com", namePattern: "git" }));
});
