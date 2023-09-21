import { ENV, IS_TEST_RUNNER, isForcedEnv } from '../config';

const aliases_modules = import.meta.glob<Record<string, string>>(
  './../__generated__/aliases_*.json',
  {
    eager: true,
  }
);

/**
 * The client who synced these operations with the server
 * @return {String}
 * @private
 */
const client = 'React';
const aliases = aliases_modules[`../__generated__/aliases_${ENV}.json`];

const standardClient = () => {
  const result = {
    /**
     * Build a string for `params[:operationId]`
     * @param {String} operationName
     * @return {String|undefined} stored operation ID
     */
    getOperationId(operationName: string) {
      return `${client}/${result.getPersistedQueryAlias(operationName)}`;
    },

    /**
     * Fetch a persisted alias from a local operation name
     * @param {String} operationName
     * @return {String} persisted alias
     */
    getPersistedQueryAlias(operationName: string) {
      const persistedAlias = aliases[operationName];
      if (!persistedAlias) {
        throw new Error(
          `Failed to find persisted alias for operation name: ${operationName}`
        );
      }
      return persistedAlias;
    },

    /**
     * Satisfy the Apollo Link API.
     * This link checks for an operation name, and if it's present,
     * sets the HTTP context to _not_ include the query,
     * and instead, include `extensions.operationId`.
     * (This is inspired by apollo-link-persisted-queries.)
     */
    apolloLink(operation: any, forward: any) {
      if (operation.operationName) {
        const operationId = result.getOperationId(operation.operationName);
        operation.setContext({
          http: {
            includeQuery: false,
            includeExtensions: true,
          },
        });
        // ActionCableLink expects the operationId to be at the root of the operation
        // https://github.com/rmosolgo/graphql-ruby/blob/7b6fdca498bed4631a1a31fc7171af0b8c707797/javascript_client/src/subscriptions/ActionCableLink.ts#L43
        operation.operationId = operationId;
        operation.extensions.operationId = operationId;
      }
      return forward(operation);
    },
    /**
     * Satisfy the Apollo middleware API.
     * Replace the query with an operationId
     */
    apolloMiddleware: {
      applyBatchMiddleware(options: any, next: any) {
        options.requests.forEach((req: any) => {
          // Fetch the persisted alias for this operation
          req.operationId = result.getOperationId(req.operationName);
          // Remove the now-unused query string
          delete req.query;
          return req;
        });
        // Continue the request
        next();
      },

      applyMiddleware(options: any, next: any) {
        const req = options.request;
        // Fetch the persisted alias for this operation
        req.operationId = result.getOperationId(req.operationName);
        // Remove the now-unused query string
        delete req.query;
        // Continue the request
        next();
      },
    },
  };
  return result;
};

export default () => {
  /*if (isForcedEnv() || import.meta.env.PLAYGROUND === 'true' || IS_TEST_RUNNER) {
    return null;
  }
  if (import.meta.env.NODE_ENV === 'development') {
    if (!aliases) {
      throw new Error(
        `\`__generated__/aliases_${ENV}.json\` doesn't exist, ` +
          `did you forget \`?force_env=staging | production\`? ` +
          `To use local \`backend:3000\` you need to run \`yarn graphql:operations:sync:development\`.`
      );
    }
  }*/
  return standardClient();
};
