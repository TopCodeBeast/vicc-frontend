import { TypedDocumentNode, gql } from '@apollo/client';
import { useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useToggle } from 'react-use';

import {
  FiatWalletAccountState,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { Text16 } from '@sorare/core/src/atoms/typography';
import CreateFiatWallet from '@sorare/core/src/components/fiatWallet/CreateFiatWallet';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import {
  WalletTab,
  useWalletDrawerContext,
} from '@sorare/core/src/contexts/walletDrawer';
import useMonetaryAmount from '@sorare/core/src/hooks/useMonetaryAmount';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';
import { glossary, wallet } from '@sorare/core/src/lib/glossary';
import { monetaryAmountFragment } from '@sorare/core/src/lib/monetaryAmount';

import { TokenTransferChildrenProps } from '@marketplace/components/token/TokenTransferValidator/types';
import useAcceptOffer from '@marketplace/hooks/offers/useAcceptOffer';
import useHasInsufficientFundsInWallets from '@marketplace/hooks/useHasInsufficientFundsInWallets';

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
      'You don’t have enough funds in your Vicc wallet to accept this offer. Add funds to your wallet to accept it.',
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
  const { toMonetaryAmount } = useMonetaryAmount();
  const [consentAgreed, setConsentAgreed] = useState(false);
  const acceptBankOffer = useAcceptOffer();
  const {
    fiatCurrency: { code },
  } = useCurrentUserContext();
  const { showNotification } = useSnackNotificationContext();
  const { showDrawer, setCurrentTab } = useWalletDrawerContext();
  const { canListAndTrade } = useFiatBalance();
  const [needsCreateFiatWallet, setNeedsCreateFiatWallet] = useState(false);
  const hasInsufficientFundsInWallets = useHasInsufficientFundsInWallets();

  const { insufficientFundsInEthWallet, insufficientFundsInFiatWallet } =
    hasInsufficientFundsInWallets(toMonetaryAmount(offer.receiverSide.amounts));

  const openAddFundsWalletTab = () => {
    showDrawer();
    setCurrentTab(WalletTab.ADD_FUNDS);
    onClose();
  };

  const [submitting, toggleSubmitting] = useToggle(false);

  const { receiverSide, id, settlementCurrencies } = offer;

  const settlementCurrency = useMemo(() => {
    const settlementCurrencyFromOffer =
      settlementCurrencies?.[0] || SupportedCurrency.WEI;
    if (settlementCurrencyFromOffer === SupportedCurrency.WEI)
      return SupportedCurrency.WEI;
    return code as SupportedCurrency;
  }, [code, settlementCurrencies]);

  const acceptOffer = async () => {
    if (settlementCurrency !== SupportedCurrency.WEI && !canListAndTrade) {
      setNeedsCreateFiatWallet(true);
      return;
    }
    toggleSubmitting();
    const errors = await acceptBankOffer({
      offerId: id,
      receiveTokens: receiverSide.nfts,
      supportedCurrency: settlementCurrency,
    });
    if (!errors) {
      showNotification('directOfferAccepted');
    }
    toggleSubmitting();
    onClose();
  };

  const canAcceptOffer = useMemo(() => {
    if (isCurrentUserSender) return true;
    if (
      settlementCurrency === SupportedCurrency.WEI &&
      insufficientFundsInEthWallet
    )
      return false;
    if (
      insufficientFundsInFiatWallet &&
      settlementCurrency !== SupportedCurrency.WEI
    )
      return false;
    return true;
  }, [
    insufficientFundsInEthWallet,
    insufficientFundsInFiatWallet,
    isCurrentUserSender,
    settlementCurrency,
  ]);

  if (needsCreateFiatWallet) {
    return (
      <CreateFiatWallet
        onClose={() => setNeedsCreateFiatWallet(false)}
        onDismissActivationSuccess={() => {
          setNeedsCreateFiatWallet(false);
          acceptOffer();
        }}
        canDismissAfterActivation
        statusTarget={FiatWalletAccountState.OWNER}
      />
    );
  }
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
            {/* {ConsentMessage && (
              <ConsentMessage
                value={consentAgreed}
                onChange={setConsentAgreed}
              />
            )} */}
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
    fragment AcceptOfferDialog_tokenOffer on Offer {
      id
      settlementCurrencies
      receiverSide {
        id
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
        nfts {
          assetId
          slug
          ...useAcceptOffer_token
        }
      }
      ...OfferSummary_tokenOffer
    }
    ${monetaryAmountFragment}
    ${useAcceptOffer.fragments.token}
    ${OfferSummary.fragments.tokenOffer}
  ` as TypedDocumentNode<AcceptOfferDialog_tokenOffer>,
};
