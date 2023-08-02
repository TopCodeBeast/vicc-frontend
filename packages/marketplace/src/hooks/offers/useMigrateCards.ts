import { TypedDocumentNode, gql, useApolloClient } from '@apollo/client';

import {
  Blockchain,
  WalletStatus,
} from '@sorare/core/src/__generated__/globalTypes';
import { useBlockchainContext } from '@sorare/core/src/contexts/blockchain';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useWalletContext } from '@sorare/core/src/contexts/wallet';

import {
  currentBlockHeightQuery,
  currentBlockHeightQueryVariables,
  useMigrateCards_token,
} from './__generated__/useMigrateCards.graphql';

const CURRENT_BLOCK_HEIGHT_QUERY = gql`
  query currentBlockHeightQuery {
    currentBlockHeight
  }
` as TypedDocumentNode<
  currentBlockHeightQuery,
  currentBlockHeightQueryVariables
>;

interface MigrationInput {
  migrateInternalCardsSignature?: string;
  migrateMappedCardsSignature?: string;
  expirationBlock: number;
}

type Cards = Record<WalletStatus.INTERNAL | WalletStatus.MAPPED, string[]>;

const useMigrateCards = () => {
  const { currentUser } = useCurrentUserContext();
  const { signMigration } = useWalletContext();
  const { signMigration: signMigrationMapped } = useBlockchainContext();
  const client = useApolloClient();

  const getCurrentBlockNumber = async () => {
    const { data } = await client.query<currentBlockHeightQuery>({
      query: CURRENT_BLOCK_HEIGHT_QUERY,
    });

    return data.currentBlockHeight;
  };

  return async (tokens: useMigrateCards_token[]) => {
    if (!currentUser) return null;

    const requiredSignatures = tokens
      .filter(
        ({ owner }) =>
          owner &&
          // TODO(jerome+baptiste): understand why it's lowercase
          owner.blockchain.toUpperCase() === Blockchain.ETHEREUM
      )
      .reduce<Cards>(
        (prev, { walletStatus, ethereumId }) => {
          if (!ethereumId) throw new Error('card should have a blockchainId');
          if (
            walletStatus !== WalletStatus.INTERNAL &&
            walletStatus !== WalletStatus.MAPPED
          )
            throw new Error('card should be in Sorare or mapped wallet');
          prev[walletStatus] = [...(prev[walletStatus] || []), ethereumId];
          return prev;
        },
        { [WalletStatus.INTERNAL]: [], [WalletStatus.MAPPED]: [] }
      );

    const { INTERNAL, MAPPED } = requiredSignatures;

    if (INTERNAL.length === 0 && MAPPED.length === 0) return null;

    const currentBlock = await getCurrentBlockNumber();
    const expirationBlock = currentBlock + 200000;

    const result: MigrationInput = {
      expirationBlock,
    };

    if (INTERNAL.length > 0) {
      const signature = await signMigration(INTERNAL, expirationBlock);
      result.migrateInternalCardsSignature = signature;
    }
    if (MAPPED.length > 0) {
      const signature = await signMigrationMapped(MAPPED, expirationBlock);
      result.migrateMappedCardsSignature = signature;
    }

    return result;
  };
};

useMigrateCards.fragments = {
  token: gql`
    fragment useMigrateCards_token on Token {
      assetId
      slug
      walletStatus
      ethereumId
      owner {
        id
        blockchain
      }
    }
  ` as TypedDocumentNode<useMigrateCards_token>,
};

export default useMigrateCards;
