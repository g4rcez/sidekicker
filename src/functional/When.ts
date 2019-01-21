export function When(pred: Function, whenTrue: Function) {
    return (x: any) => (pred(x) ? whenTrue(x) : x);
}
