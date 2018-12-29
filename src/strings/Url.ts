export const extractParameters = (url: string) => url.match(/[^&?]*?=[^&?]*/g);

export const objectParameters = (url: string) =>
    extractParameters(url)
        .map((x) => new Set(x.split("&").map((q) => q.split("="))))
        .reduce((acc, el) => {
            const values = el.values().next().value;
            try {
                return { ...acc, [values[0]]: JSON.parse(values[1]) };
            } catch (error) {
                return { ...acc, [values[0]]: values[1] };
            }
        }, {});
