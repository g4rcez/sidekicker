export default interface Operator {
  readonly like: Function;
  readonly '==': Function;
  readonly '===': Function;
  readonly '!=': Function;
  readonly [key: string]: Function;
}
