import { SnakeCase } from '@core/types';

export const toSnakeCase = <T extends string>(str: T): SnakeCase<T> =>
  str
    // Look for long acronyms and filter out the last letter
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    // Look for lower-case letters followed by upper-case letters
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    // Look for lower-case letters followed by numbers
    .replace(/([a-zA-Z])(\d)(.+)/g, '$1_$2$3')
    // Remove any white space left around the word
    .toLowerCase()
    .trim() as SnakeCase<T>;

type map = { [key: string]: any };

export const paramsToSnakeCase = (params: map | map[]) => {
  const transformedParams = [params].flat().map(param => {
    const result: { [key: string]: any } = {};
    Object.keys(param).forEach(k => {
      result[toSnakeCase(k)] =
        typeof param[k] === 'object' ? paramsToSnakeCase(param[k]) : param[k];
    });

    return result;
  });

  return Array.isArray(params) ? transformedParams : transformedParams[0];
};

export default toSnakeCase;
