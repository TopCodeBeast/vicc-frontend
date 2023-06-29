import { CamelCase } from '@core/types';

export const toCamelCase = <T extends string>(str: T): CamelCase<T> =>
  str
    ?.replace(/(?:\s|_)(.)/g, $1 => $1.toUpperCase())
    .replace(/\s|_/g, '')
    .replace(/^(.)/, $1 => $1.toLowerCase()) as CamelCase<T>;

export const paramsToCamelCase = (params: { [key: string]: any }) => {
  const result: { [key: string]: any } = {};
  Object.keys(params).forEach(k => {
    result[toCamelCase(k)] = params[k];
  });
  return result;
};

export function resultsToCamelCase(results: string): string;
export function resultsToCamelCase(results: string[]): string[];
export function resultsToCamelCase(results: { [key: string]: string }): {
  [key: string]: string;
};
export function resultsToCamelCase(
  results: string | string[] | { [key: string]: string }
): string | string[] | { [key: string]: string } {
  if (results && typeof results === 'object') {
    if (Array.isArray(results)) {
      return results.map(r => resultsToCamelCase(r));
    }

    return Object.keys(results).reduce(
      (acc, k) => {
        acc[toCamelCase(k)] = resultsToCamelCase(results[k]);
        return acc;
      },
      {} as {
        [key: string]: string;
      }
    );
  }
  return results;
}
