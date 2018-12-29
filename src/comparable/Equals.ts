const equals = (target: any, value: any) => {
    if (typeof target === typeof value) {
        return true;
    }
    return false;
};
