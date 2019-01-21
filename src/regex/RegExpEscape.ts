const regExpEscape = (regex: string) => {
    return regex.replace(".", "\\.");
};

export default regExpEscape;
