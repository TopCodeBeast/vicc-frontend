import { gql } from '@apollo/client';
import { ReactNode, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { glossary } from '@sorare/core/src/lib/glossary';
import { toWei } from '@sorare/core/src/lib/wei';
import { theme } from '@sorare/core/src/style/theme';

import OfferDealSummary from 'components/offer/OfferDealSummary';
import { TokenTransferValidator } from 'components/token/TokenTransferValidator';
import { useMarketplaceEvents } from 'lib/events';

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

const Content = styled.div`
  width: 100%;
  margin: var(--double-unit) 0;
  padding: 0 var(--double-unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    min-width: calc(
      ${theme.breakpoints.values.tablet}px - var(--double-and-a-half-unit)
    );
  }
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
  width: 100%;
  gap: var(--double-unit);
`;

export const Summary = <D extends BaseType>({
  title,
  cancel,
  dispatch,
  state,
  sender,
  receiver,
}: Props<D>) => {
  const { up: isTablet } = useScreenSize('tablet');
  const track = useMarketplaceEvents();
  const onConfirm = useCallback(() => {
    state.submit(dispatch, state);
    track('Click Submit Trade');
  }, [dispatch, state, track]);

  const setBuilding = useCallback(() => dispatch(switchToBuilding), [dispatch]);

  const {
    sendEth,
    receiveEth,
    receiveMarketFeesEth,
    sendCards,
    cardsData,
    receiveCards,
    stage,
    duration,
    paymentMethod,
  } = state;

  const [consentAgreed, setConsentAgreed] = useState(false);

  const receiveTokens = receiveCards.map(c => cardsData[c.objectID]);

  const sendTokens = sendCards.map(c => cardsData[c.objectID]);

  const isSubmitting = stage === 'submitting';

  return (
    <TokenTransferValidator tokens={sendTokens} transferContext="send_trade">
      {({ validationMessages, ConsentMessage }) => (
        <Dialog
          open
          onBack={setBuilding}
          shadowFooter
          noMargin
          headerCentered
          fullScreen={!isTablet}
          title={title}
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
        >
          <Content>
            <OfferDealSummary
              sendWeiAmount={toWei(sendEth)}
              receiveWeiAmount={toWei(receiveEth)}
              marketFeeAmountWei={toWei(receiveMarketFeesEth)}
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
        </Dialog>
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
  `,
};

export default Summary;
