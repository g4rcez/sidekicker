import { flat } from "../iterable";
import { isEmpty } from "ramda";
import { ValidateObject, ValidatorCheck, ValidatorOptions, ValidatorRules, ValidatorTuple } from "Validator";

const unpack = (val: any, key: string) => {
	if (val) {
		return { null: false, value: val[key] };
	}
	return { null: true, value: false };
};

const validate = (obj: any, key: string) => (tuple: ValidatorTuple): ValidateObject => {
	const [message, fn] = tuple;
	return { message, valid: fn(obj[key], obj) };
};

export function Validator<T>(values: T, specs: ValidatorRules, options?: ValidatorOptions) {
	const validations: ValidatorCheck = Object.keys(values).reduce((acc: any, key: string) => {
		const errors = specs[key]
			.map(validate(values, key))
			.filter((obj) => (unpack(options, "showSuccess").value ? true : !obj.valid));
		return isEmpty(errors) ? acc : { ...acc, [key]: errors };
	}, {});
	const flatMessages = unpack(options, "flatMessages");
	if (!flatMessages.value) {
		return validations;
	}
	const flatted = Object.keys(validations).map((x) => validations[x].map((y) => y.message));
	const messages = flat(flatted);
	return unpack(options, "flatMessagesWithErrors").value ? { messages, validations } : messages;
}
