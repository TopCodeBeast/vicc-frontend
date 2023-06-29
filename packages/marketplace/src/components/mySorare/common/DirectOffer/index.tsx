import { gql } from '@apollo/client';
import classNames from 'classnames';
import { useMemo } from 'react';
import styled from 'styled-components';

import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { isA } from '@sorare/core/src/lib/gql';

import { TokenTransferValidator } from '@marketplace/components/token/TokenTransferValidator';
import useRejectOffer from '@marketplace/hooks/offers/useRejectOffer';

import CounteredOffer from './CounteredOffer';
import CounterpartUser from './CounterpartUser';
import DirectOfferBody from './DirectOfferBody';
import DirectOfferStatus from './DirectOfferStatus';
import { MySorareDirectOffer_tokenOffer } from './__generated__/index.graphql';

type MySorareDirectOffer_tokenOffer_receiver_User =
  MySorareDirectOffer_tokenOffer['receiver'] & { __typename: 'User' };

type MySorareDirectOffer_tokenOffer_sender_User =
  MySorareDirectOffer_tokenOffer['sender'] & { __typename: 'User' };

type Props = {
  offer: MySorareDirectOffer_tokenOffer;
  inModale?: boolean;
};

const Container = styled.div`
  padding: var(--double-unit);
  background: var(--c-neutral-200);
  color: var(--c-neutral-1000);
  border-radius: var(--double-unit);
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);

  &.inModale {
    background: var(--c-neutral-300);
  }
`;
const Header = styled.div`
  padding-bottom: var(--double-unit);
`;

const DirectOffer = ({ offer, inModale }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const rejectOffer = useRejectOffer();
  const { status, blockchainId, sender, receiver } = offer;
  const blockAndReject: (() => Promise<void>) | undefined = useMemo(() => {
    if (status === 'accepted') {
      return undefined;
    }
    if (blockchainId === null) {
      return undefined;
    }
    return async () => {
      await rejectOffer(blockchainId, { block: true });
    };
  }, [status, blockchainId, rejectOffer]);

  if (
    !receiver ||
    !isA<MySorareDirectOffer_tokenOffer_sender_User>('User', sender) ||
    !isA<MySorareDirectOffer_tokenOffer_receiver_User>('User', receiver)
  ) {
    return null;
  }

  const isCurrentUserSender = currentUser?.slug === sender.slug;

  const counterpartUser = isCurrentUserSender ? receiver : sender;
  const counterpartNature = isCurrentUserSender ? 'receiver' : 'sender';

  return (
    <TokenTransferValidator
      tokens={
        isCurrentUserSender ? offer.senderSide.nfts : offer.receiverSide.nfts
      }
      shouldValidate={offer.status === 'opened'}
      transferContext={isCurrentUserSender ? 'send_trade' : 'receive_trade'}
    >
      {({ validationMessages, loading: validationLoading, ConsentMessage }) => (
        <Container className={classNames({ inModale })}>
          <Header>
            <CounterpartUser
              user={counterpartUser}
              offer={offer}
              nature={counterpartNature}
              block={isCurrentUserSender ? undefined : blockAndReject}
            />
          </Header>
          <DirectOfferBody
            offer={offer}
            counterpartUser={counterpartUser}
            isCurrentUserSender={isCurrentUserSender}
            validationMessages={validationMessages}
          />
          {offer.counteredOffer && (
            <CounteredOffer
              offer={offer.counteredOffer}
              counterpartUser={counterpartUser}
              wasCurrentUserSender={!isCurrentUserSender}
            />
          )}
          <DirectOfferStatus
            validationLoading={validationLoading}
            ConsentMessage={ConsentMessage}
            validationMessages={validationMessages}
            offer={offer}
            isCurrentUserSender={isCurrentUserSender}
          />
        </Container>
      )}
    </TokenTransferValidator>
  );
};

DirectOffer.fragments = {
  tokenOffer: gql`
    fragment MySorareDirectOffer_tokenOffer on TokenOffer {
      id
      status
      ...MySorareDirectOfferStatus_tokenOffer
      ...CounterpartUser_tokenOffer
      sender {
        ... on User {
          slug
          ...CounterpartUser_publicUserInfoInterface
          ...CounteredOffer_publicUserInfoInterface
          ...MySorareDirectOfferBody_publicUserInfoInterface
        }
      }
      senderSide {
        id
        nfts {
          assetId
          slug
          ...TokenTransferValidator_token
        }
      }
      receiver {
        ... on User {
          slug
          ...CounterpartUser_publicUserInfoInterface
          ...CounteredOffer_publicUserInfoInterface
          ...MySorareDirectOfferBody_publicUserInfoInterface
        }
      }
      ...MySorareDirectOfferBody_tokenOffer
      counteredOffer {
        id
        ...CounteredOffer_tokenOffer
      }
    }
    ${DirectOfferStatus.fragments.tokenOffer}
    ${DirectOfferBody.fragments.tokenOffer}
    ${CounterpartUser.fragments.user}
    ${CounteredOffer.fragments.user}
    ${CounteredOffer.fragments.tokenOffer}
    ${CounterpartUser.fragments.tokenOffer}
    ${TokenTransferValidator.fragments.token}
    ${DirectOfferBody.fragments.user}
  `,
};

export default DirectOffer;
