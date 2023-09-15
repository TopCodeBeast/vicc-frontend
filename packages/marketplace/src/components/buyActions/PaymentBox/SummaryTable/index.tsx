import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  Currency,
  Sport,
  SupportedCurrency,
} from '@sorare/core/src/__generated__/globalTypes';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import { MonetaryAmountOutput } from '@sorare/core/src/hooks/useMonetaryAmount';

import { PaymentBoxAmountWithConversion } from '@marketplace/components/buyActions/PaymentBox/AmountWithConversion';

import { SummaryTableTotal } from './SummaryTableTotal';
import { AccountingLine, Row } from './ui';

const Wrapper = styled.div`
  &:not(:first-child) {
    border-top: solid 1px var(--c-neutral-400);
  }
`;

const Text16WithTooltip = styled(Text16)`
  display: flex;
  gap: var(--half-unit);
  align-items: center;
`;

const InfoCircle = styled(FontAwesomeIcon)`
  opacity: 0.5;
`;

const FeesDetails = styled.a`
  color: var(--c-neutral-600);
  text-decoration: underline;
  &:hover {
    color: var(--c-neutral-600);
  }
`;

export type Props = {
  subtotalMonetaryAmount: MonetaryAmountOutput;
  fees: number;
  feesMonetaryAmount: MonetaryAmountOutput;
  totalMonetaryAmount: MonetaryAmountOutput;
  conversionCreditMonetaryAmount?: MonetaryAmountOutput;
  isFiat: boolean;
  isCreditCard: boolean;
  usingConversionCredit: boolean;
  sport: Sport;
  customAmountDisplay: ReactNode;
  hideFees?: boolean;
  hideSubtotal?: boolean;
  canChangeRefCurrency?: boolean;
};

export const SummaryTable = ({
  subtotalMonetaryAmount,
  fees,
  feesMonetaryAmount,
  totalMonetaryAmount,
  isFiat,
  isCreditCard,
  usingConversionCredit,
  customAmountDisplay,
  hideFees,
  hideSubtotal,
  canChangeRefCurrency,
  conversionCreditMonetaryAmount,
  sport,
}: Props) => {
  return (
    <Wrapper>
      {!hideSubtotal && (
        <Row>
          <AccountingLine>
            <Text16 color="var(--c-neutral-1000)">
              <FormattedMessage
                id="SummaryTable.subtotal"
                defaultMessage="Subtotal"
              />
            </Text16>
            {customAmountDisplay || (
              <PaymentBoxAmountWithConversion
                monetaryAmount={subtotalMonetaryAmount}
                hideExponent={canChangeRefCurrency}
              />
            )}
          </AccountingLine>
        </Row>
      )}
      {!customAmountDisplay && isCreditCard && isFiat && !hideFees && (
        <Row>
          <AccountingLine>
            <Text16WithTooltip color="var(--c-neutral-1000)">
              <FormattedMessage
                id="PaymentBox.creditCardFees"
                defaultMessage="Credit card fees"
              />
              <Tooltip
                interactive
                placement="top"
                title={
                  <Caption>
                    <FormattedMessage
                      id="PaymentBox.creditCardFeesInfo"
                      defaultMessage="A {fees}% credit card fee is charged at the time of the purchase. {more}"
                      values={{
                        fees: fees * 100,
                        more: (
                          <FeesDetails
                            href="https://help.vicc.com/hc/en-us/articles/4402889674897"
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            <FormattedMessage
                              id="PaymentBox.moreDetails"
                              defaultMessage="More details"
                            />
                          </FeesDetails>
                        ),
                      }}
                    />
                  </Caption>
                }
              >
                <InfoCircle icon={faInfoCircle} />
              </Tooltip>
            </Text16WithTooltip>
            <PaymentBoxAmountWithConversion
              monetaryAmount={feesMonetaryAmount}
              hideExponent={canChangeRefCurrency}
              {...(canChangeRefCurrency && {
                primaryCurrency: isFiat ? Currency.FIAT : Currency.ETH,
              })}
            />
          </AccountingLine>
        </Row>
      )}
      {!customAmountDisplay && isFiat && !isCreditCard && (
        <Row>
          <AccountingLine>
            <Text16WithTooltip color="var(--c-neutral-1000)">
              <FormattedMessage
                id="PaymentBox.fiatWalletFee"
                defaultMessage="Transaction fee"
              />
              <Tooltip
                interactive
                placement="top"
                title={
                  <Caption>
                    <FormattedMessage
                      id="PaymentBox.cashWalletFeeInfo"
                      defaultMessage="No fees are required for this payment."
                    />
                  </Caption>
                }
              >
                <InfoCircle icon={faInfoCircle} />
              </Tooltip>
            </Text16WithTooltip>
            <PaymentBoxAmountWithConversion
              monetaryAmount={feesMonetaryAmount}
              hideExponent={canChangeRefCurrency}
              {...(canChangeRefCurrency && {
                primaryCurrency: isFiat ? Currency.FIAT : Currency.ETH,
              })}
            />
          </AccountingLine>
        </Row>
      )}
      {!isFiat && !hideFees && (
        <Row>
          <AccountingLine>
            <Text16WithTooltip color="var(--c-neutral-1000)">
              <FormattedMessage
                id="PaymentBox.gasFees"
                defaultMessage="Gas fees"
              />
              <Tooltip
                interactive
                placement="top"
                title={
                  <Caption as="span">
                    <FormattedMessage
                      id="PaymentBox.gasFeesInfo"
                      defaultMessage="No fees are required for this payment."
                    />
                  </Caption>
                }
              >
                <InfoCircle icon={faInfoCircle} />
              </Tooltip>
            </Text16WithTooltip>
            <PaymentBoxAmountWithConversion
              monetaryAmount={{
                referenceCurrency: SupportedCurrency.WEI,
                wei: '0',
              }}
              hideExponent={canChangeRefCurrency}
              {...(canChangeRefCurrency && {
                primaryCurrency: isFiat ? Currency.FIAT : Currency.ETH,
              })}
            />
          </AccountingLine>
        </Row>
      )}
      <SummaryTableTotal
        usingConversionCredit={usingConversionCredit}
        sport={sport}
        customAmountDisplay={customAmountDisplay}
        totalMonetaryAmount={totalMonetaryAmount}
        canChangeRefCurrency={canChangeRefCurrency}
        conversionCreditMonetaryAmount={conversionCreditMonetaryAmount}
        isFiat={isFiat}
      />
    </Wrapper>
  );
};

export default SummaryTable;
