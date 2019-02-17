export type EitherType<L, R> = R | L;
export type EitherTuple<L, R> = EitherType<L, R>;

export interface IEither<L, R> {
	isLeft: boolean;
	isRight: boolean;
	left: L | null;
	right: R | null;
}
