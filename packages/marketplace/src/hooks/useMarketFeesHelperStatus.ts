import { gql } from '@apollo/client';

import { useMarketFeesHelperStatus_token } from './__generated__/useMarketFeesHelperStatus.graphql';

export enum MarketFeeStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  PARTIALLY_ENABLED = 'partially-enabled',
}

export const isMarketFeeEnabled = (
  status: MarketFeeStatus
): status is MarketFeeStatus.ENABLED | MarketFeeStatus.PARTIALLY_ENABLED =>
  [MarketFeeStatus.ENABLED, MarketFeeStatus.PARTIALLY_ENABLED].includes(status);

export const useMarketFeesHelperStatus = (
  tokens: useMarketFeesHelperStatus_token[]
) => {
  const enabledTokens = tokens.filter(token => token.secondaryMarketFeeEnabled);

  if (enabledTokens.length === 0) {
    return MarketFeeStatus.DISABLED;
  }

  if (enabledTokens.length === tokens.length) {
    return MarketFeeStatus.ENABLED;
  }

  return MarketFeeStatus.PARTIALLY_ENABLED;
};

useMarketFeesHelperStatus.fragments = {
  token: gql`
    fragment useMarketFeesHelperStatus_token on Token {
      assetId
      slug
      secondaryMarketFeeEnabled
    }
  `,
};

export default useMarketFeesHelperStatus;
