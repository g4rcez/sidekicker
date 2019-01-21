import { flat } from "@itr";
import { isEmpty } from "ramda";
import { ValidateObject, ValidatorCheck, ValidatorOptions, ValidatorRules, ValidatorTuple } from "Validator";

const unpack = (object: any, key: string) => {
    if (object) {
        return { null: false, value: object[key] };
    }
    return { null: true, value: false };
};

const validate = (obj: any, key: string) => (tuple: ValidatorTuple): ValidateObject => {
    const [message, fn] = tuple;
    return {
        message,
        valid: fn(obj[key], obj),
    };
};

export function Validator<T>(values: T, specs: ValidatorRules, options?: ValidatorOptions) {
    const validated: ValidatorCheck = Object.keys(values).reduce((acc: T, key: string) => {
        const errors = specs[key]
            .map(validate(values, key))
            .filter((obj) => (unpack(options, "showSuccess").value ? true : !obj.valid));
        return isEmpty(errors) ? acc : { ...acc, [key]: errors };
    }, {});
    const flatMessages = unpack(options, "flatMessages");
    if (flatMessages.value) {
        const flatted = Object.keys(validated).map((x) => validated[x].map((y) => y.message));
        const flatErrors = unpack(options, "flatMessagesWithErrors").value;
        const messages = flat(flatted);
        return flatErrors ? { messages, validations: validated } : messages;
    }
    return validated;
}
