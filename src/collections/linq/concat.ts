export default function concat<T>(toConcat: T[]) {
    return (targetArray: T[]) => {
        return targetArray.concat(toConcat);
    };
}
