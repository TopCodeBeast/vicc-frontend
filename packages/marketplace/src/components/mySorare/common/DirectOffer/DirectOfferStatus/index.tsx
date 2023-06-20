import { gql } from '@apollo/client';
import {
  faCalendarTimes,
  faCheck,
  faTimes,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import Blockquote from '@sorare/core/src/atoms/layout/Blockquote';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { glossary } from '@sorare/core/src/lib/glossary';
import { isA } from '@sorare/core/src/lib/gql';
import { theme } from '@sorare/core/src/style/theme';

import CounterOfferBuilder from '@sorare/marketplace/src/components/directOffer/CounterOfferBuilder';
import { TokenTransferChildrenProps } from '@sorare/marketplace/src/components/token/TokenTransferValidator/types';
import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';
import useCancelOffer from '@sorare/marketplace/src/hooks/offers/useCancelOffer';
import useRejectOffer from '@sorare/marketplace/src/hooks/offers/useRejectOffer';

import DirectOfferDialog from '../DirectOfferDialog';
import OfferSummary from '../OfferSummary';
import { MySorareDirectOffer_tokenOffer } from '../__generated__/index.graphql';
import { AcceptOfferDialog } from './AcceptOfferDialog';
import { MySorareDirectOfferStatus_tokenOffer } from './__generated__/index.graphql';

type MySorareDirectOffer_tokenOffer_receiver_User =
  MySorareDirectOffer_tokenOffer['receiver'] & { __typename: 'User' };

type MySorareDirectOffer_tokenOffer_sender_User =
  MySorareDirectOffer_tokenOffer['sender'] & { __typename: 'User' };

type MySorareDirectOfferStatus_tokenOffer_receiver_User =
  MySorareDirectOfferStatus_tokenOffer['receiver'] & { __typename: 'User' };

type MySorareDirectOfferStatus_tokenOffer_sender_User =
  MySorareDirectOfferStatus_tokenOffer['sender'] & { __typename: 'User' };

const messages = defineMessages({
  nothing: {
    id: 'DirectOfferStatus.nothing',
    defaultMessage: 'NOTHING',
  },
  counterOffer: {
    id: 'DirectOfferStatus.counterOffer',
    defaultMessage: 'Counter',
  },
  reject: {
    id: 'DirectOfferStatus.reject',
    defaultMessage: 'Reject',
  },
  block: {
    id: 'DirectOfferStatus.block',
    defaultMessage: 'Block',
  },
  accepted: {
    id: 'DirectOfferStatus.accepted',
    defaultMessage: 'Accepted',
  },
  transferInProgress: {
    id: 'DirectOfferStatus.transferInProgress',
    defaultMessage: 'Transfer in Progress',
  },
  rejected: {
    id: 'DirectOfferStatus.rejected',
    defaultMessage: 'Rejected',
  },
  expired: {
    id: 'DirectOfferStatus.expired',
    defaultMessage: 'Expired',
  },
  confirmRejectTitle: {
    id: 'DirectOfferStatus.confirmReject.title',
    defaultMessage: 'Reject the offer',
  },
  confirmCancelTitle: {
    id: 'DirectOfferStatus.confirmCancel.title',
    defaultMessage: 'Cancel the offer',
  },
});

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  gap: var(--double-unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-direction: row;
  }
`;

const Layout = styled.div`
  width: 100%;
  gap: var(--double-unit);
  display: flex;
  flex-direction: column;
`;

const CanceledMessage = styled.div`
  color: var(--c-yellow-600);
  font-weight: var(--t-bold);
`;

const GreyMessage = styled.div`
  color: var(--c-neutral-600);
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-left: var(--double-unit);
`;

const DirectOfferStatus = ({
  offer,
  isCurrentUserSender,
  validationMessages,
  ConsentMessage,
  validationLoading,
}: {
  offer: MySorareDirectOfferStatus_tokenOffer;
  isCurrentUserSender: boolean;
  validationLoading: boolean;
} & Pick<
  TokenTransferChildrenProps,
  'validationMessages' | 'ConsentMessage'
>) => {
  const oneSidedOffer = useMemo<boolean>(() => {
    if (
      isCurrentUserSender &&
      offer.receiverSide.nfts.length === 0 &&
      !(offer.receiverSide.wei && offer.receiverSide.wei !== '0')
    ) {
      return true;
    }
    if (
      offer.senderSide.nfts.length === 0 &&
      !(offer.senderSide.wei && offer.senderSide.wei !== '0')
    )
      return true;

    return false;
  }, [
    isCurrentUserSender,
    offer.receiverSide.nfts.length,
    offer.receiverSide.wei,
    offer.senderSide.nfts.length,
    offer.senderSide.wei,
  ]);
  const [showAcceptButton, setShowAcceptButton] = useState(!oneSidedOffer);

  const senderNickname = isA<MySorareDirectOffer_tokenOffer_sender_User>(
    'User',
    offer.sender
  ) ? (
    <Nickname user={offer.sender} />
  ) : (
    'anonymous'
  );
  const receiverNickname = isA<MySorareDirectOffer_tokenOffer_receiver_User>(
    'User',
    offer.receiver
  ) ? (
    <Nickname user={offer.receiver} />
  ) : (
    'anonymous'
  );
  const counterpartUserNickname = isCurrentUserSender
    ? receiverNickname
    : senderNickname;

  const { formatMessage } = useIntl();
  const { trackClickTrade } = useMarketplaceContext();
  const [submitting, toggleSubmitting] = useToggle(false);
  const { showNotification } = useSnackNotificationContext();
  const rejectBankOffer = useRejectOffer();
  const cancelBankOffer = useCancelOffer();
  const { currentUser } = useCurrentUserContext();
  const [counterOfferBuilderOpen, toggleCounterOfferBuilderOpen] =
    useToggle(false);
  const [acceptOfferDialogOpen, setAcceptOfferDialogOpen] = useState(false);

  const [directOfferDialog, setDirectOfferDialog] = useState<
    { title: string; content: ReactNode; actions: ReactNode } | false
  >(false);

  const cta = async (
    action: () => Promise<any>,
    message: 'directOfferCancelled' | 'directOfferRejected'
  ) => {
    toggleSubmitting();
    const errors = await action();
    if (!errors) {
      showNotification(message);
    }
    toggleSubmitting();
    setDirectOfferDialog(false);
  };

  const counterOfferTo = useMemo(() => {
    if (isCurrentUserSender) {
      if (
        offer.receiver &&
        isA<MySorareDirectOfferStatus_tokenOffer_receiver_User>(
          'User',
          offer.receiver
        )
      ) {
        return offer.receiver;
      }
    } else if (
      offer.sender &&
      isA<MySorareDirectOfferStatus_tokenOffer_sender_User>(
        'User',
        offer.sender
      )
    ) {
      return offer.sender;
    }

    return null;
  }, [isCurrentUserSender, offer.receiver, offer.sender]);

  const { status, blockchainId } = offer;

  if (!blockchainId) return null;

  const reject = ({ block }: { block: boolean }) => {
    cta(
      async () => rejectBankOffer(blockchainId, { block }),
      'directOfferRejected'
    );
  };

  const confirmReject = () => {
    setDirectOfferDialog({
      title: formatMessage(messages.confirmRejectTitle),
      content: <OfferSummary offer={offer} actionType="reject" />,
      actions: (
        <Button
          medium
          stroke
          color="red"
          onClick={() => reject({ block: false })}
        >
          <FormattedMessage {...messages.reject} />
        </Button>
      ),
    });
  };

  const cancel = () => {
    cta(async () => cancelBankOffer(blockchainId), 'directOfferCancelled');
  };
  const confirmCancel = () => {
    setDirectOfferDialog({
      title: formatMessage(messages.confirmCancelTitle),
      content: <OfferSummary offer={offer} />,
      actions: (
        <Button medium stroke color="red" onClick={cancel}>
          <FormattedMessage {...glossary.cancel} />
        </Button>
      ),
    });
  };

  const openCounterOfferBuilder = () => {
    toggleCounterOfferBuilderOpen();
    trackClickTrade(offer.id);
  };

  const renderSentOffer = () => {
    return (
      <Button onClick={confirmCancel} color="red" medium stroke>
        {formatMessage(glossary.cancel)}
      </Button>
    );
  };

  const renderMintedOffer = () => {
    if (isCurrentUserSender) {
      return renderSentOffer();
    }

    return (
      <Layout>
        {oneSidedOffer && (
          <Blockquote variant="red">
            <FormattedMessage
              id="DirectOfferStatus.oneSided"
              defaultMessage={`⚠️ This is a one sided offer, you are about to send something to a manager named "{nickname}" without anything in return, be careful.`}
              values={{
                nickname: <em>{counterpartUserNickname}</em>,
              }}
            />
            <br />
            <Button
              small
              stroke
              color="red"
              onClick={() => setShowAcceptButton(true)}
            >
              <FormattedMessage
                id="DirectOfferStatus.confirm"
                defaultMessage="I want to accept anyway"
              />
            </Button>
          </Blockquote>
        )}
        <Container>
          {showAcceptButton && (
            <Button
              onClick={() => {
                setAcceptOfferDialogOpen(true);
              }}
              color="blue"
              medium
            >
              <FormattedMessage {...glossary.accept} />
            </Button>
          )}
          {counterOfferTo && currentUser && (
            <>
              <Button
                onClick={openCounterOfferBuilder}
                disabled={submitting}
                color="darkGray"
                medium
              >
                {formatMessage(messages.counterOffer)}
              </Button>
              {counterOfferBuilderOpen && (
                <CounterOfferBuilder
                  onClose={toggleCounterOfferBuilderOpen}
                  to={counterOfferTo}
                  previousOffer={offer}
                  currentUser={currentUser}
                />
              )}
            </>
          )}
          <Button onClick={confirmReject} color="red" medium stroke>
            {formatMessage(messages.reject)}
          </Button>
        </Container>
      </Layout>
    );
  };

  const renderOfferStatus = () => {
    switch (status) {
      case 'pending_rejection':
      case 'minted':
      case 'opened': {
        return renderMintedOffer();
      }
      case 'accepted': {
        return (
          <GreyMessage>
            <FormattedMessage {...messages.accepted} />
            <StyledFontAwesomeIcon color="green" icon={faCheck} />
          </GreyMessage>
        );
      }
      case 'pending_migration':
      case 'settlable': {
        return (
          <CanceledMessage>
            <FormattedMessage {...messages.transferInProgress} />
          </CanceledMessage>
        );
      }
      case 'flagged':
      case 'cancelled': {
        return (
          <GreyMessage>
            <FormattedMessage {...glossary.canceled} />
            <StyledFontAwesomeIcon color="red" icon={faTimes} />
          </GreyMessage>
        );
      }
      case 'rejected': {
        return (
          <GreyMessage>
            <FormattedMessage {...messages.rejected} />
            <StyledFontAwesomeIcon color="red" icon={faTimes} />
          </GreyMessage>
        );
      }
      case 'ended': {
        return (
          <GreyMessage>
            <FormattedMessage {...messages.expired} />
            <StyledFontAwesomeIcon icon={faCalendarTimes} />
          </GreyMessage>
        );
      }
      default: {
        return null;
      }
    }
  };

  return (
    <Container>
      {renderOfferStatus()}
      {directOfferDialog && (
        <DirectOfferDialog
          onClose={() => setDirectOfferDialog(false)}
          {...directOfferDialog}
        />
      )}
      {acceptOfferDialogOpen && (
        <AcceptOfferDialog
          offer={offer}
          onClose={() => setAcceptOfferDialogOpen(false)}
          isCurrentUserSender={isCurrentUserSender}
          validationLoading={validationLoading}
          validationMessages={validationMessages}
          ConsentMessage={ConsentMessage}
        />
      )}
    </Container>
  );
};

DirectOfferStatus.fragments = {
  tokenOffer: gql`
    fragment MySorareDirectOfferStatus_tokenOffer on TokenOffer {
      id
      blockchainId
      status
      senderSide {
        id
        wei
        nfts {
          assetId
          slug
        }
      }
      receiverSide {
        id
        wei
        nfts {
          assetId
          slug
        }
      }
      sender {
        ... on User {
          slug
        }
      }
      receiver {
        ... on User {
          slug
        }
      }
      ...OfferSummary_tokenOffer
      ...CounterOfferBuilder_tokenOffer
    }
    ${OfferSummary.fragments.tokenOffer}
    ${CounterOfferBuilder.fragments.tokenOffer}
  `,
};

export default DirectOfferStatus;
