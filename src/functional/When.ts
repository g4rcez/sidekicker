export default function When(pred: Function, whenTrue: Function) {
    return function(x: any) {
        return pred(x) ? whenTrue(x) : x;
    };
}
