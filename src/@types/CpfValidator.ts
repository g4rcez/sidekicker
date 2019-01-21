export type CpfValidator = {
    states?: string[];
    digit?: number;
    mask?: boolean;
    [key: string]: string[] | number | boolean;
};
