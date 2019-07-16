const regexCellPhone = /^(\(|)\d\d(\)|)( |)\d{4,5}(-| |)\d{4}$/;
const regexTelephone = /^(\(|)\d\d(\)|)( |)\d{4}(-| |)\d{4}$/;
export const isCellphone = (x: string) => (!!x ? x.match(regexCellPhone) : false);
export const isTelephone = (x: string) => (!!x ? x.match(regexTelephone) : false);
