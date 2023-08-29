import { TypedDocumentNode, gql } from '@apollo/client';
import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useState } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import { SupportedCurrency } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import Blockquote from '@sorare/core/src/atoms/layout/Blockquote';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';
import { glossary } from '@sorare/core/src/lib/glossary';

import TokenSummary from '@marketplace/components/buyActions/TokenSummary';
import CalculatedFeesTooltip from '@marketplace/components/offer/CalculatedFeesTooltip';
import { TokenTransferChildrenProps } from '@marketplace/components/token/TokenTransferValidator/types';

import { ConfirmationDialogContent_token } from './__generated__/index.graphql';

const Column = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: var(--half-unit);
`;

const Main = styled.span<{ $warning: boolean }>`
  font: var(--t-bold) var(--t-48);
  ${props => (props.$warning ? `color: var(--c-red-600);` : '')}
`;

const PriceRow = styled.div`
  display: flex;
  align-items: top;
  gap: var(--unit);
`;
const Exponent = styled(Text14)`
  color: var(--c-neutral-600);
`;

type Props = {
  monetaryAmount: MonetaryAmountOutput;
  referenceCurrency: SupportedCurrency;
  onClose: () => void;
  showWarningMessage: boolean;
  submitting: boolean;
  submit: () => void;
  warningMessage: MessageDescriptor & { values?: Record<string, unknown> };
  secondaryMarketFeesRate: number;
  validationMessages?: ReactNode;
  ConsentMessage?: TokenTransferChildrenProps['ConsentMessage'];
  token: ConfirmationDialogContent_token;
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Amount = styled.div`
  display: flex;
  align-items: baseline;
  margin: 0 auto;
  gap: 10px;
`;
const Actions = styled.div`
  display: flex;
  gap: 10px;
  & > * {
    flex-grow: 1;
  }
`;

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: var(--double-unit);
  background: var(--c-neutral-300);
  margin: var(--double-unit) 0;
  padding: var(--double-unit);
  gap: var(--double-unit);
`;

const Title = styled(Text16).attrs({ bold: true })`
  text-align: center;
  color: var(--c-neutral-600);
`;

const ConfirmationDialogContent = ({
  showWarningMessage,
  monetaryAmount,
  referenceCurrency,
  onClose,
  submitting,
  submit,
  warningMessage,
  secondaryMarketFeesRate,
  validationMessages,
  ConsentMessage,
  token,
}: Props) => {
  const { main, exponent } = useAmountWithConversion({
    monetaryAmount: {
      referenceCurrency,
      ...monetaryAmount,
    },
  });
  const [consentAgreed, setConsentAgreed] = useState(false);

  return (
    <Root>
      <Amount>
        <Column>
          <Title>
            <FormattedMessage
              id="OfferDialog.title"
              defaultMessage="Your price"
            />
          </Title>
          {main && (
            <PriceRow>
              <Main $warning={showWarningMessage}>{main}</Main>
              {secondaryMarketFeesRate > 0 && (
                <Tooltip
                  enterTouchDelay={0}
                  interactive
                  placement="top"
                  title={
                    <CalculatedFeesTooltip
                      referenceCurrency={referenceCurrency}
                      monetaryAmount={monetaryAmount}
                      feesRate={secondaryMarketFeesRate}
                    />
                  }
                >
                  <div>
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </div>
                </Tooltip>
              )}
            </PriceRow>
          )}
          {exponent && <Exponent>{`≈ ${exponent}`}</Exponent>}
        </Column>
      </Amount>
      <DetailsWrapper>
        <TokenSummary token={token} />
        {showWarningMessage && (
          <Blockquote variant="red">
            <FormattedMessage {...warningMessage} />
          </Blockquote>
        )}
        {validationMessages}
      </DetailsWrapper>
      {/* {ConsentMessage && (
        <ConsentMessage value={consentAgreed} onChange={setConsentAgreed} />
      )} */}
      <Actions>
        <Button medium onClick={onClose} color="white" disabled={submitting}>
          <FormattedMessage {...glossary.cancel} />
        </Button>
        <LoadingButton
          medium
          onClick={submit}
          color="blue"
          loading={submitting}
          disabled={!!ConsentMessage && !consentAgreed}
        >
          <FormattedMessage {...glossary.confirm} />
        </LoadingButton>
      </Actions>
    </Root>
  );
};

ConfirmationDialogContent.fragments = {
  token: gql`
    fragment ConfirmationDialogContent_token on Token {
      assetId
      slug
      ...TokenSummary_token
    }
    ${TokenSummary.fragments.token}
  ` as TypedDocumentNode<ConfirmationDialogContent_token>,
};
export default ConfirmationDialogContent;
