import { ApolloLink } from '@apollo/client';
import { useMemo } from 'react';

import { useTMContext } from '@sorare/core/src/contexts/tm';

interface Props {
  path: string;
}

export const useTMLink = ({ path }: Props) => {
  const logOperation = useTMContext()?.logOperation;

  const tmLink = useMemo(() => {
    if (!logOperation) {
      return undefined;
    }

    return new ApolloLink((operation, forward) => {
      const start = new Date().getTime();

      return forward(operation).map(response => {
        const context = operation.getContext();

        if (!context.response) {
          // this is a websocket response, no HTTP response provided
          return response;
        }

        const { operationName } = operation;
        const timeMs = new Date().getTime() - start;

        // Do not log ReportTelemetry to avoid requests when the client is idle
        if (operationName !== 'ReportTelemetry') {
          logOperation({ name: operationName, timeMs, path });
        }

        return response;
      });
    });
  }, [logOperation, path]);

  return tmLink;
};
