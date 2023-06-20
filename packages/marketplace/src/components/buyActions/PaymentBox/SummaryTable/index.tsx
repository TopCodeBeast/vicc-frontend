import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  Currency,
  Fiat,
  Sport,
} from '@sorare/core/src/__generated__/globalTypes';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';

import PaymentBoxAmountWithConversion from 'components/buyActions/PaymentBox/AmountWithConversion';

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
  subtotalWeiAmount: string;
  subtotalAmountInFiat?: Fiat;
  fees: number;
  feesWeiAmount: string;
  feesFiatAmount?: Fiat;
  totalWeiAmount: string;
  totalFiatAmount?: Fiat;
  isFiat: boolean;
  isCreditCard: boolean;
  usingConversionCredit: boolean;
  sport: Sport;
  customAmountDisplay: ReactNode;
  hideFees?: boolean;
  hideSubtotal?: boolean;
};

export const SummaryTable = ({
  subtotalWeiAmount,
  subtotalAmountInFiat,
  fees,
  feesWeiAmount,
  feesFiatAmount,
  totalWeiAmount,
  totalFiatAmount,
  isFiat,
  isCreditCard,
  usingConversionCredit,
  customAmountDisplay,
  hideFees,
  hideSubtotal,
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
                amount={subtotalWeiAmount}
                amountInFiat={subtotalAmountInFiat}
                unit="wei"
                context="SummaryTable — Subtotal"
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
                arrow
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
                            href="https://help.sorare.com/hc/en-us/articles/4402889674897"
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
              amount={feesWeiAmount}
              amountInFiat={feesFiatAmount}
              unit="wei"
              context="creditCardFees"
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
                arrow
                interactive
                placement="top"
                title={
                  <Caption>
                    <FormattedMessage
                      id="PaymentBox.fiatWalletFeeInfo"
                      defaultMessage="A {fees}% transaction fee is charged at the time of the purchase. {more}"
                      values={{
                        fees: fees * 100,
                        more: (
                          <FeesDetails
                            href="https://help.sorare.com/hc/en-us/articles/4402889674897"
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
              amount={feesWeiAmount}
              amountInFiat={feesFiatAmount}
              unit="wei"
              context="fiatWalletFees"
            />
          </AccountingLine>
        </Row>
      )}
      {!customAmountDisplay && !isFiat && !hideFees && (
        <Row>
          <AccountingLine>
            <Text16WithTooltip color="var(--c-neutral-1000)">
              <FormattedMessage
                id="PaymentBox.gasFees"
                defaultMessage="Gas fees"
              />
              <Tooltip
                arrow
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
              amount="0"
              unit="wei"
              context="GasFee"
            />
          </AccountingLine>
        </Row>
      )}
      <SummaryTableTotal
        usingConversionCredit={usingConversionCredit}
        sport={sport}
        currency={isFiat ? Currency.FIAT : Currency.ETH}
        customAmountDisplay={customAmountDisplay}
        totalWeiAmount={totalWeiAmount}
        totalFiatAmount={totalFiatAmount}
      />
    </Wrapper>
  );
};

export default SummaryTable;
