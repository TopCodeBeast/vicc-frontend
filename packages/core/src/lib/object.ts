export const mapKeys = <
  T extends Record<any, any>,
  F extends (k: keyof T) => any
>(
  object: T,
  transformFn: F
) => {
  return Object.keys(object).reduce((acc, cur) => {
    return {
      ...acc,
      [transformFn(cur)]: object[cur],
    };
  }, {});
};
