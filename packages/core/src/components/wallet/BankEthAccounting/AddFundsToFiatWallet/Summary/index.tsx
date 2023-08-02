import { ReactNode, useCallback, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { FiatCurrency } from '__generated__/globalTypes';
import LoadingButton from '@core/atoms/buttons/LoadingButton';
import { Caption, Text14, Text16, Title4 } from '@core/atoms/typography';
import CreditCardFeeTooltip from '@core/components/creditCard/CreditCardFeeTooltip';
import { ThreeDSIframe } from '@core/components/creditCard/ThreeDSIframe';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useIntlContext } from '@core/contexts/intl';
import { useCreateCardDeposit } from '@core/hooks/creditCard/useCreateCardDeposit';
import { glossary } from '@core/lib/glossary';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--c-neutral-300);
  padding: var(--double-unit) 0;
`;

const TotalRow = styled(Row)`
  border-bottom: none;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

const messages = defineMessages({
  title: {
    id: 'AddFundsToFiatWallet.Summary.title',
    defaultMessage: 'Deposit summary',
  },
  amountLabel: {
    id: 'AddFundsToFiatWallet.Summary.amountLabel',
    defaultMessage: 'Deposit amount',
  },
  feeLabel: {
    id: 'AddFundsToFiatWallet.Summary.feeLabel',
    defaultMessage: 'Card processing fee',
  },
  total: {
    id: 'AddFundsToFiatWallet.Summary.total',
    defaultMessage: 'Total',
  },
  caption: {
    id: 'AddFundsToFiatWallet.Summary.caption',
    defaultMessage:
      'Please note that some banks charge processing fees on credit card transactions.',
  },
});

const feeRates = {
  [FiatCurrency.EUR]: 0.01,
  [FiatCurrency.GBP]: 0.01,
  [FiatCurrency.USD]: 0.03,
};

type Props = {
  amount: number;
  onSuccess: () => void;
  cardId: string;
  creditCardPreview: ReactNode;
  saveCreditCard: boolean;
};

export const Summary = ({
  amount,
  onSuccess,
  cardId,
  creditCardPreview,
  saveCreditCard,
}: Props) => {
  const [depositErrors, setDepositErrors] = useState<string[]>([]);
  const [createDeposit, { loading }] = useCreateCardDeposit();
  const [mangopay3DSUrl, setMangopay3DSUrl] = useState<string | undefined>(
    undefined
  );
  const { formatNumber } = useIntlContext();
  const {
    fiatCurrency: { code },
  } = useCurrentUserContext();
  const createDepositCb = useCallback(
    async (cardIdValue: string) => {
      if (amount) {
        setDepositErrors([]);
        const result = await createDeposit({
          variables: {
            input: {
              cardId: cardIdValue,
              amount: amount * 100,
              browserInfo: {
                colorDepth: window.screen.colorDepth,
                language: navigator.language,
                screenHeight: window.screen.height,
                screenWidth: window.screen.width,
                timeZoneOffset: new Date().getTimezoneOffset(),
              },
              saveCard: saveCreditCard,
            },
          },
        });
        if (result.errors && result.errors.length > 0) {
          setDepositErrors(result.errors.map(e => e.message));
          return;
        }
        if (result.data?.createCardDeposit?.secureModeRedirectUrl) {
          setMangopay3DSUrl(
            result.data?.createCardDeposit?.secureModeRedirectUrl
          );
          return;
        }
        onSuccess();
      }
    },
    [amount, saveCreditCard, createDeposit, onSuccess, setDepositErrors]
  );

  const fees = amount * feeRates[code];

  return (
    <>
      <Wrapper>
        <Title4>
          <FormattedMessage {...messages.title} />
        </Title4>
        <div>
          <Row>
            <Text14>
              <FormattedMessage {...messages.amountLabel} />
            </Text14>
            <Text14>
              {formatNumber(amount - fees, {
                style: 'currency',
                currency: code,
              })}
            </Text14>
          </Row>
          <Row>
            <Label>
              <Text14>
                <FormattedMessage {...messages.feeLabel} />{' '}
              </Text14>
              <CreditCardFeeTooltip />
            </Label>
            <Text14>
              {formatNumber(fees, {
                style: 'currency',
                currency: code,
              })}
            </Text14>
          </Row>
          <TotalRow>
            <Text16 bold>
              <FormattedMessage {...messages.total} />
            </Text16>
            <Text16 bold>
              {formatNumber(amount, {
                style: 'currency',
                currency: code,
              })}
            </Text16>
          </TotalRow>
          <Caption color="var(--c-neutral-600)">
            <FormattedMessage {...messages.caption} />
          </Caption>
        </div>
        {creditCardPreview}
        {depositErrors.length > 0 && (
          <Text14 color="var(--c-red-600)">{depositErrors.join('')}</Text14>
        )}
        <LoadingButton
          medium
          color="blue"
          loading={loading}
          onClick={() => {
            createDepositCb(cardId);
          }}
        >
          <FormattedMessage {...glossary.deposit} />
        </LoadingButton>
      </Wrapper>
      {mangopay3DSUrl && (
        <ThreeDSIframe
          url={mangopay3DSUrl}
          onSuccess={() => {
            setMangopay3DSUrl(undefined);
            onSuccess();
          }}
          onCancel={() => setMangopay3DSUrl(undefined)}
        />
      )}
    </>
  );
};
