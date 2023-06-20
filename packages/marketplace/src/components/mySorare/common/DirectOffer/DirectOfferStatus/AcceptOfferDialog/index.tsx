import { gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useToggle } from 'react-use';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { Text16 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import {
  WalletTab,
  useWalletDrawerContext,
} from '@sorare/core/src/contexts/walletDrawer';
import { glossary, wallet } from '@sorare/core/src/lib/glossary';
import { fromWei } from '@sorare/core/src/lib/wei';

import { TokenTransferChildrenProps } from '@sorare/marketplace/src/components/token/TokenTransferValidator/types';
import useAcceptOffer from '@sorare/marketplace/src/hooks/offers/useAcceptOffer';

import DirectOfferDialog from '../../DirectOfferDialog';
import OfferSummary from '../../OfferSummary';
import { AcceptOfferDialog_tokenOffer } from './__generated__/index.graphql';

type Props = {
  onClose: () => void;
  offer: AcceptOfferDialog_tokenOffer;
  isCurrentUserSender: boolean;
  validationLoading: boolean;
} & Pick<TokenTransferChildrenProps, 'ConsentMessage' | 'validationMessages'>;

const messages = defineMessages({
  confirmAcceptTitle: {
    id: 'DirectOfferStatus.confirmAccept.title',
    defaultMessage: 'Accept the offer',
  },

  needFundsTitle: {
    id: 'DirectOfferStatus.needFundsTitle',
    defaultMessage: 'Not enough funds',
  },

  needFundsHelper: {
    id: 'DirectOfferStatus.needFundsHelper',
    defaultMessage:
      'You don’t have enough funds in your Sorare wallet to accept this offer. Add funds to your wallet to accept it.',
  },
});

export const AcceptOfferDialog = ({
  onClose,
  offer,
  isCurrentUserSender,
  ConsentMessage,
  validationMessages,
  validationLoading,
}: Props) => {
  const { currentUser } = useCurrentUserContext();
  const [consentAgreed, setConsentAgreed] = useState(false);
  const acceptBankOffer = useAcceptOffer();
  const { showNotification } = useSnackNotificationContext();
  const { showDrawer, setCurrentTab } = useWalletDrawerContext();

  const openAddFundsWalletTab = () => {
    showDrawer();
    setCurrentTab(WalletTab.ADD_FUNDS);
    onClose();
  };

  const [submitting, toggleSubmitting] = useToggle(false);

  const { receiverSide, id } = offer;

  const acceptOffer = async () => {
    toggleSubmitting();
    const errors = await acceptBankOffer({
      offerId: id,
      receiveTokens: receiverSide.nfts,
      supportedCurrency: SupportedCurrency.WEI,
    });
    if (!errors) {
      showNotification('directOfferAccepted');
    }
    toggleSubmitting();
    onClose();
  };

  const canAcceptOffer = !isCurrentUserSender
    ? fromWei(offer.receiverSide.wei) <=
      fromWei(currentUser?.availableBalance || '0')
    : true;

  return (
    <DirectOfferDialog
      onClose={onClose}
      title={
        <FormattedMessage
          {...(canAcceptOffer
            ? messages.confirmAcceptTitle
            : messages.needFundsTitle)}
        />
      }
      content={
        canAcceptOffer ? (
          <>
            <OfferSummary
              offer={offer}
              validationMessages={validationMessages}
            />
            {ConsentMessage && (
              <ConsentMessage
                value={consentAgreed}
                onChange={setConsentAgreed}
              />
            )}
          </>
        ) : (
          <Text16>
            <FormattedMessage {...messages.needFundsHelper} />
          </Text16>
        )
      }
      actions={
        <LoadingButton
          medium
          color="blue"
          onClick={canAcceptOffer ? acceptOffer : openAddFundsWalletTab}
          loading={validationLoading || submitting}
          disabled={!!ConsentMessage && !consentAgreed}
        >
          <FormattedMessage
            {...(canAcceptOffer ? glossary.accept : wallet.addFunds)}
          />
        </LoadingButton>
      }
    />
  );
};

AcceptOfferDialog.fragments = {
  tokenOffer: gql`
    fragment AcceptOfferDialog_tokenOffer on TokenOffer {
      id
      receiverSide {
        wei
        nfts {
          assetId
          slug
          ...useAcceptOffer_token
        }
      }

      ...OfferSummary_tokenOffer
    }
    ${useAcceptOffer.fragments.token}
    ${OfferSummary.fragments.tokenOffer}
  `,
};
