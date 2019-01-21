export type ValidatorTuple = [string, Function];
export type ValidatorRules = {
    [key: string]: ValidatorTuple[];
};
export type ValidatorCheck = {
    [key: string]: ValidateObject[];
};
export type ValidateObject = {
    message: string;
    valid: boolean;
};
export type ValidatorOptions = {
    flatMessages?: boolean;
    showSuccess?: boolean;
    flatMessagesWithErrors?: boolean;
};
