export const sameArrays = (array1: any[], array2: any[]) =>
  array1.length === array2.length &&
  [...array1]
    .sort()
    .every((value, index) => value === [...array2].sort()[index]);

export function inGroups<T>(list: T[], size: number) {
  const result = [];
  const a = list.slice(0);
  while (a[0]) {
    result.push(a.splice(0, size));
  }
  return result;
}

export function groupBy<T, K extends number | string>(
  key: (obj: T) => K,
  list: T[]
) {
  return list.reduce<{ [index: string]: T[] }>((res, obj) => {
    const v: any = key(obj);
    (res[v] = res[v] || []).push(obj);
    return res;
  }, {});
}

export function arrayToObject<T, S = T>({
  key,
  value,
  list,
}: {
  key: (obj: T) => string;
  value: (obj: T) => S;
  list: T[];
}) {
  return list.reduce(
    (acc, curr) =>
      key(curr)
        ? {
            ...acc,
            [key(curr)]: value(curr),
          }
        : acc,
    {}
  );
}

export function difference<T>(a: T[], b: T[]) {
  const map = new Map();
  return a.filter(
    v => !map.get(v) || !map.set(v, map.get(v) - 1),
    b.reduce((acc, v) => acc.set(v, (acc.get(v) || 0) + 1), map)
  );
}

export function sortBy<T>(key: (obj: T) => string | number, list: T[]) {
  return list.sort((a, b) => {
    if (key(a) < key(b)) {
      return -1;
    }
    if (key(a) > key(b)) {
      return 1;
    }
    return 0;
  });
}

export function toggleItem<T>(
  list: T[],
  value: T,
  accessor: (obj: T) => boolean
) {
  const arr = [...list];
  const index = list.findIndex(accessor);
  if (index === -1) {
    arr.push(value);
  } else {
    arr.splice(index, 1);
  }
  return arr;
}

export function uniqueBy<T>(key: (obj: T) => string, list: T[]) {
  const keys = list.map(key);
  return list.filter((item, pos) => keys.indexOf(key(item)) === pos);
}

// So that Object.keys returns the correct type: cf https://github.com/microsoft/TypeScript/pull/12253
export const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[];

export function diff<T>(a: T[], b: T[]) {
  return a.filter(i => b.indexOf(i) < 0);
}

export function randomElement(array: []): undefined;
export function randomElement<T>(array: T[]): T;
export function randomElement<T>(array: T[]): T | undefined {
  if (!array.length) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

export enum LenientPolicy {
  UNKNOWN_AT_TAIL = 1,
  UNKNOWN_AT_HEAD = -1,
}

export const lenientArrayIndexComparator = <T extends string>(
  array: readonly T[],
  policy: LenientPolicy = LenientPolicy.UNKNOWN_AT_HEAD
) => {
  const whenLenient = policy as number;
  return (a: string, b: string) => {
    const leftIndex = array.indexOf(a as T);
    const rightIndex = array.indexOf(b as T);
    if (leftIndex < 0) {
      if (rightIndex < 0) {
        return a.localeCompare(b);
      }
      return whenLenient;
    }
    if (rightIndex < 0) {
      return -whenLenient;
    }
    return leftIndex - rightIndex;
  };
};

export const byArrayIndexComparator =
  <T>(array: T[]) =>
  (a: T, b: T) =>
    array.indexOf(a) - array.indexOf(b);

export function sortByArrayIndex<T>(array: readonly T[], a: T, b: T): number {
  return array.indexOf(a) - array.indexOf(b);
}

export function evenIndices(_element: any, index: number) {
  return index % 2 === 0;
}

export function partition<T>(
  ary: T[],
  predicate: (value: T, index: number) => boolean
) {
  return ary.reduce<T[][]>(
    (res, obj) => {
      res[predicate(obj, ary.indexOf(obj)) ? 0 : 1].push(obj);
      return res;
    },
    [[], []]
  );
}

export function removeElement<T>(array: T[], element: T): T[] {
  const index = array.indexOf(element);
  if (index < 0) {
    return array;
  }
  const result = [...array];
  result.splice(index, 1);
  return result;
}

export function range(size: number) {
  return Array.from(Array(size).keys());
}

export function replace<T extends any[]>(
  array: T,
  index: number,
  elt: T[0]
): T {
  return [...array.slice(0, index), elt, ...array.slice(index + 1)] as T;
}

export function findLastIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean
): number {
  let l = array.length;
  while (l) {
    l -= 1;
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
}

export function findIndexStartingFrom<T>(
  array: Array<T>,
  startingIndex: number,
  predicate: (value: T, index: number, obj: T[]) => boolean
): number {
  for (let i = startingIndex; i < array.length; i += 1) {
    if (predicate(array[i], i, array)) return i;
  }
  return -1;
}
