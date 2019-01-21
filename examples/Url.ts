import { urlOnlyParameters, urlParameters as Url } from "../src";

console.log(Url("https://www.youtube.com/watch?v=o9PuAm7d0PA&index=24&list=RDM4ZoCHID9GI"));
console.log(urlOnlyParameters("https://www.youtube.com/watch?v=o9PuAm7d0PA&index=24&list=RDM4ZoCHID9GI"));

const url = "https://www.youtube.com/watch?v=o9PuAm7d0PA&index=24&list=RDM4ZoCHID9GI";

console.log(url.split("://")[0]);
