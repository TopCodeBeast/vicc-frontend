import {
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  // eslint-disable-next-line no-restricted-imports
  useQuery as apolloUseQuery,
} from '@apollo/client';
import { DocumentNode } from 'graphql';

import { useWalletContext } from '@sorare/core/src/contexts/wallet';
import useLogOut from '@sorare/core/src/hooks/auth/useLogOut';

let logoutTimeout: ReturnType<typeof setTimeout> | undefined;

export default function useQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>,
  logOutOnErrorCode = 422
): QueryResult<TData, TVariables> {
  const applogOut = useLogOut();
  const { error, ...rest } = apolloUseQuery(query, options);
  const walletCtx = useWalletContext();

  const logOut = () => {
    (async () => {
      try {
        if (walletCtx) {
          await walletCtx.logOut();
        } else {
          await applogOut();
        }
      } finally {
        logoutTimeout = undefined;
      }
    })();
  };

  if (error) {
    if (error.networkError) {
      if ((error.networkError as any).statusCode === logOutOnErrorCode) {
        // Allow only one logout at a time to avoid infinite loop
        if (!logoutTimeout) {
          // logout asynchronously to avoid running into "Store reset while query was in flight" error
          logoutTimeout = setTimeout(logOut, 1000);
        }

        return { error, ...rest };
      }
      if (!(error.networkError as any).statusCode) {
        throw error;
      }
      throw error.networkError;
    }
  }

  return rest;
}
