import { TypedDocumentNode, gql } from '@apollo/client';

import { useConfigContext } from '@core/contexts/config';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { generateDealId } from '@core/lib/deal';

import {
  useGenerateDeal_card,
  useGenerateDeal_user,
} from './__generated__/useGenerateDeal.graphql';

interface Args {
  sendTokens?: useGenerateDeal_card[];
  receiveTokens?: useGenerateDeal_card[];
  sendAmountInWei?: string;
  receiveAmountInWei?: string;
  receiver?: useGenerateDeal_user;
}

const toTokenIds = (cards: useGenerateDeal_card[]) => {
  const tokenIds: string[] = [];
  cards.forEach(c => {
    if (!c.blockchainId) throw new Error('Card should have a blockchainId');
    tokenIds.push(c.blockchainId);
  });

  return tokenIds;
};

const useGenerateDeal = () => {
  const { bankAddress } = useConfigContext();
  const { currentUser } = useCurrentUserContext();

  return ({
    sendTokens = [],
    receiveTokens = [],
    sendAmountInWei = '0',
    receiveAmountInWei = '0',
    receiver,
  }: Args) => {
    return {
      dealId: generateDealId(),
      sender: currentUser!.sorareAddress!,
      receiver: receiver?.sorareAddress || null,
      receiveTokenIds: toTokenIds(receiveTokens),
      sendTokenIds: toTokenIds(sendTokens),
      sendAmountInWei,
      minReceiveAmountInWei: receiveAmountInWei,
      bankAddress,
    };
  };
};

useGenerateDeal.fragments = {
  card: gql`
    fragment useGenerateDeal_card on Card {
      slug
      assetId
      blockchainId
    }
  ` as TypedDocumentNode<useGenerateDeal_card>,
  user: gql`
    fragment useGenerateDeal_user on PublicUserInfoInterface {
      slug
      sorareAddress
    }
  ` as TypedDocumentNode<useGenerateDeal_user>,
};

export default useGenerateDeal;
