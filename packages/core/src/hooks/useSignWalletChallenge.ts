import { TypedDocumentNode, gql, useApolloClient } from '@apollo/client';

import { useWalletContext } from '@core/contexts/wallet';

import {
  WalletChallengeQuery,
  WalletChallengeQueryVariables,
} from './__generated__/useSignWalletChallenge.graphql';

const WALLET_CHALLENGE_QUERY = gql`
  query WalletChallengeQuery {
    config {
      walletChallenge
    }
  }
` as TypedDocumentNode<WalletChallengeQuery, WalletChallengeQueryVariables>;

export default () => {
  const client = useApolloClient();
  const { signWalletChallenge: sign } = useWalletContext();

  const signWalletChallenge = async () => {
    const result = await client.query<
      WalletChallengeQuery,
      WalletChallengeQueryVariables
    >({ query: WALLET_CHALLENGE_QUERY });

    return sign(result?.data?.config?.walletChallenge);
  };

  return { signWalletChallenge };
};
