import { ApolloLink } from '@apollo/client';
import { useMemo } from 'react';

import { useDebugContext } from '@sorare/core/src/contexts/debug';

import { isProduction } from '../../config';

export const useDebugLink = () => {
  const recordGQLOperation = useDebugContext()?.recordGQLOperation;

  const debugLink = useMemo(() => {
    if (
      !recordGQLOperation ||
      isProduction ||
      process.env.NODE_ENV === 'test'
    ) {
      return undefined;
    }

    return new ApolloLink((operation, forward) => {
      return forward(operation).map(response => {
        const context = operation.getContext();
        if (!context.response) {
          // this is a websocket response, no HTTP response provided
          return response;
        }
        const {
          response: { headers },
        } = context;

        recordGQLOperation({
          id: crypto.getRandomValues(new Uint32Array(4)).join(''),
          operation,
          complexity: Number(headers.get('x-gql-complexity')),
          depth: Number(headers.get('x-gql-depth')),
        });

        return response;
      });
    });
  }, [recordGQLOperation]);

  return debugLink;
};
