import { EitherType } from "TypeEither";

export function Either<L, R>(value: EitherType<L, R>) {
	function Left(result: EitherType<L, R>): result is L {
		return result instanceof Error;
	}
	function Right(result: EitherType<L, R>): result is R {
		return !Left(result);
	}
	return {
		isLeft: Left(value),
		isRight: Right(value),
		left: Left(value) ? value : null,
		right: Right(value) ? value : null,
	};
}
