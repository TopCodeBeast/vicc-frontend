import { gql } from '@apollo/client';
import styled from 'styled-components';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';
import { theme } from '@sorare/core/src/style/theme';

import { OfferUser } from '@marketplace/components/directOffer/NewOfferBuilder/OfferUser';
import OfferDealSummary from '@marketplace/components/offer/OfferDealSummary';
import { TokenTransferChildrenProps } from '@marketplace/components/token/TokenTransferValidator/types';

import { OfferSummary_tokenOffer } from './__generated__/index.graphql';

type OfferSummary_tokenOffer_receiver_User =
  OfferSummary_tokenOffer['receiver'] & { __typename: 'User' };

type OfferSummary_tokenOffer_sender_User = OfferSummary_tokenOffer['sender'] & {
  __typename: 'User';
};

function isUser<T extends { nickname?: string }>(entity: T | any): entity is T {
  return !!entity && (entity as T).nickname !== undefined;
}

export interface Props {
  offer: OfferSummary_tokenOffer;
  actionType?: 'reject' | 'cancel' | 'accept' | 'counter';
  validationMessages?: TokenTransferChildrenProps['validationMessages'];
}

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 calc(var(--double-and-a-half-unit * -1));
  @media ${tabletAndAbove} {
    min-width: calc(
      ${theme.breakpoints.values.tablet}px - var(--double-and-a-half-unit)
    );
  }
`;

export const OfferSummary = ({
  offer,
  actionType,
  validationMessages,
}: Props) => {
  const { currentUser } = useCurrentUserContext();

  const { receiver, sender, receiverSide, senderSide, marketFeeAmountWei } =
    offer;

  if (!currentUser) return null;
  if (!isUser<OfferSummary_tokenOffer_receiver_User>(receiver)) return null;
  if (!isUser<OfferSummary_tokenOffer_sender_User>(sender)) return null;

  const received = receiver.slug === currentUser.slug;

  return (
    <Summary>
      <OfferDealSummary
        sendWeiAmount={received ? receiverSide.wei : senderSide.wei}
        receiveWeiAmount={received ? senderSide.wei : receiverSide.wei}
        marketFeeAmountWei={marketFeeAmountWei || undefined}
        receiveTokens={received ? senderSide.nfts : receiverSide.nfts}
        sendTokens={received ? receiverSide.nfts : senderSide.nfts}
        withEmpty
        actionType={actionType}
        validationMessages={validationMessages}
        sender={<OfferUser user={received ? receiver : sender} />}
        receiver={<OfferUser user={received ? sender : receiver} isReceiver />}
        paymentMethod={null}
      />
    </Summary>
  );
};

OfferSummary.fragments = {
  tokenOffer: gql`
    fragment OfferSummary_tokenOffer on TokenOffer {
      id
      sender {
        ... on User {
          slug
          nickname
          ...OfferUser_user
        }
      }
      receiver {
        ... on User {
          slug
          nickname
          ...OfferUser_user
        }
      }
      receiverSide {
        id
        wei
        nfts {
          assetId
          slug
          ...OfferDealSummary_token
        }
      }
      priceWei
      senderSide {
        id
        wei
        nfts {
          assetId
          slug
          ...OfferDealSummary_token
        }
      }
      marketFeeAmountWei
    }
    ${OfferDealSummary.fragments.token}
    ${OfferUser.fragments.user}
  `,
};

export default OfferSummary;
