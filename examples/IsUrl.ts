import { isUrl } from "../src/validations";

[
    "https://translate.google.com/?hl=pt-BR#view=home&op=translate&sl=auto&tl=pt&text=too",
    // "www.facebook.com",
    // "ws://www.facebook.com",
    // "github.com/vandalvnl/sidekicker",
    // "mysql://github.com/vandalvnl/sidekicker",
].forEach((x) => console.log(isUrl(x, { domain: "google.com", protocols: ["ws", "mysql"], maxRoutes: 2 }), x));

const ok = isUrl("https://github.com/vandalvnl/sidekicker", {
    maxRoutes: 3,
    protocols: ["ws"],
    domain: "github.com",
});

console.log(ok);
