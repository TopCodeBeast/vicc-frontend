import { useMemo } from 'react';

export default (expression: string) =>
  useMemo(() => new RegExp(expression), [expression]);
