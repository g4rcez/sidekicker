export default interface CpfValidator {
  states?: string[];
  digit?: number;
  mask?: boolean;
  [key: string]: string[] | number | boolean;
}
