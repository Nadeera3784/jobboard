export function parseJson<T>(input: any): T {
 return JSON.parse(input) as T;
}
