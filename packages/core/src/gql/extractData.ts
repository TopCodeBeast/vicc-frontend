type Connection<T> = {
  nodes: T[];
  totalCount?: number;
  pageInfo: { endCursor: string | null; hasNextPage: boolean };
};

type ExtractedData<T> = {
  items: T[];
  count?: number;
  cursor: string | null;
  hasMore: boolean;
};

type NoData = {
  items: undefined;
  count: undefined;
  cursor: undefined;
  hasMore: undefined;
};

const EMPTY: NoData = {
  items: undefined,
  count: undefined,
  cursor: undefined,
  hasMore: undefined,
} as const;

export const extractConnectionData = <T, U>(
  data: Connection<T> | undefined,
  adapt: (src: T) => U
): ExtractedData<U> | Readonly<NoData> => {
  if (data) {
    const { pageInfo } = data;
    return {
      items: data.nodes.map(src => adapt(src)),
      count: data.totalCount,
      cursor: pageInfo?.endCursor || null,
      hasMore: pageInfo?.hasNextPage || false,
    };
  }
  return EMPTY;
};

export const extractArrayData = <T, U>(
  data: T[] | undefined,
  adapt: (src: T) => U
): ExtractedData<U> | Readonly<NoData> => {
  if (data) {
    return {
      items: data.map(adapt),
      count: data.length,
      cursor: null,
      hasMore: false,
    };
  }
  return EMPTY;
};
