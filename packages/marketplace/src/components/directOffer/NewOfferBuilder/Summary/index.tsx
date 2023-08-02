import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  FiatWalletAccountState,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { Text16 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import CreateFiatWallet from '@sorare/core/src/components/fiatWallet/CreateFiatWallet';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { useFiatBalance } from '@sorare/core/src/hooks/wallets/useFiatBalance';
import { glossary } from '@sorare/core/src/lib/glossary';

import OfferDealSummary from '@marketplace/components/offer/OfferDealSummary';
import { TokenTransferValidator } from '@marketplace/components/token/TokenTransferValidator';
import { useMarketplaceEvents } from '@marketplace/lib/events';

import { switchToBuilding } from '../actions';
import { CardDataType, StateProps } from '../types';
import { OfferBuilderSummary_token } from './__generated__/index.graphql';

type BaseType = CardDataType & OfferBuilderSummary_token;

type Props<D extends BaseType> = StateProps<D> & {
  cancel: () => void;
  title: string;
  sender: ReactNode;
  receiver: ReactNode;
};

const CenteredText16 = styled(Text16)`
  text-align: center;
`;
const Content = styled.div`
  width: 100%;
  padding: 0 var(--triple-unit) var(--triple-unit) var(--triple-unit);
`;
const ButtonsBar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: var(--double-unit);
`;
const CancelCta = styled(Button)`
  width: 50%;
`;
const ConfirmCta = styled(LoadingButton)`
  width: 50%;
`;
const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  padding: var(--unit) var(--triple-unit) var(--triple-unit) var(--triple-unit);
  box-shadow: 0px 14px 50px rgba(0, 0, 0, 0.2);
  width: 100%;
`;

export const Summary = <D extends BaseType>({
  title,
  cancel,
  dispatch,
  state,
  sender,
  receiver,
}: Props<D>) => {
  const [needsCreateFiatWallet, setNeedsCreateFiatWallet] = useState(false);
  const { canListAndTrade } = useFiatBalance();
  const {
    flags: { useCashWallet },
  } = useFeatureFlags();
  const { up: isTablet } = useScreenSize('tablet');
  const track = useMarketplaceEvents();

  const {
    sendAmount,
    receiveAmount,
    receiveMarketFeesAmount,
    sendAmountCurrency,
    receiveAmountCurrency,
    sendCards,
    cardsData,
    receiveCards,
    stage,
    duration,
    paymentMethod,
  } = state;

  const setBuilding = () => dispatch(switchToBuilding);

  const onConfirm = () => {
    setNeedsCreateFiatWallet(false);
    if (
      !canListAndTrade &&
      useCashWallet &&
      receiveAmountCurrency !== SupportedCurrency.WEI &&
      receiveAmount.eur > 0
    ) {
      setNeedsCreateFiatWallet(true);
      return;
    }
    state.submit(dispatch, state);
    track('Click Submit Trade');
  };
  const [consentAgreed, setConsentAgreed] = useState(false);

  const receiveTokens = receiveCards.map(c => cardsData[c.objectID]);

  const sendTokens = sendCards.map(c => cardsData[c.objectID]);

  const isSubmitting = stage === 'submitting';

  if (needsCreateFiatWallet) {
    return (
      <CreateFiatWallet
        statusTarget={FiatWalletAccountState.OWNER}
        onClose={() => setNeedsCreateFiatWallet(false)}
        onDismissActivationSuccess={onConfirm}
        canDismissAfterActivation
      />
    );
  }
  return (
    <TokenTransferValidator tokens={sendTokens} transferContext="send_trade">
      {({ validationMessages, ConsentMessage }) => (
        <Dialog
          open
          maxWidth="md"
          onBack={setBuilding}
          fullScreen={!isTablet}
          title={<CenteredText16>{title}</CenteredText16>}
          body={
            <Content>
              <OfferDealSummary
                sendAmount={sendAmount}
                receiveAmount={receiveAmount}
                sendAmountCurrency={sendAmountCurrency}
                receiveAmountCurrency={receiveAmountCurrency}
                marketFeeAmount={receiveMarketFeesAmount}
                receiveTokens={receiveTokens}
                sendTokens={sendTokens}
                duration={duration}
                withEmpty
                sender={sender}
                receiver={receiver}
                validationMessages={validationMessages}
                paymentMethod={paymentMethod}
              />
            </Content>
          }
          footer={
            <FooterWrapper>
              {ConsentMessage && (
                <ConsentMessage
                  value={consentAgreed}
                  onChange={setConsentAgreed}
                />
              )}
              <ButtonsBar>
                <CancelCta
                  color="white"
                  onClick={cancel}
                  disabled={isSubmitting}
                  medium
                >
                  <FormattedMessage {...glossary.cancel} />
                </CancelCta>
                <ConfirmCta
                  onClick={onConfirm}
                  medium
                  color="blue"
                  loading={isSubmitting}
                  disabled={!!ConsentMessage && !consentAgreed}
                >
                  <FormattedMessage {...glossary.confirm} />
                </ConfirmCta>
              </ButtonsBar>
            </FooterWrapper>
          }
        />
      )}
    </TokenTransferValidator>
  );
};

Summary.fragments = {
  token: gql`
    fragment OfferBuilderSummary_token on Token {
      assetId
      slug
      ...OfferDealSummary_token
    }
    ${OfferDealSummary.fragments.token}
  ` as TypedDocumentNode<OfferBuilderSummary_token>,
};

export default Summary;
