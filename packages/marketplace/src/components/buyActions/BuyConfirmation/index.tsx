import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Title5 } from '@sorare/core/src/atoms/typography';
import { payment as paymentMessages } from '@sorare/core/src/lib/glossary';

import SelectedPaymentMethodForConfirmation, {
  Props as SelectedPaymentMethodForConfirmationProps,
} from '@sorare/marketplace/src/components/buyActions/PaymentBox/Methods/SelectedPaymentMethodForConfirmation';
import SummaryTable, {
  Props as SummaryTableProps,
} from '@sorare/marketplace/src/components/buyActions/PaymentBox/SummaryTable';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const OrderSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  border-top: solid 1px var(--c-neutral-400);
  padding-top: var(--double-unit);
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const Preview = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--triple-unit);
  align-items: center;
  text-align: center;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  max-width: 280px;
`;

export type Props = {
  summaryTableProps: SummaryTableProps;
  seller?: ReactNode;
  payment: SelectedPaymentMethodForConfirmationProps;
  itemPreview: ReactNode;
  title: ReactNode;
  helper: ReactNode;
  orderSummary: ReactNode;
};

export const BuyConfirmation = ({
  seller,
  summaryTableProps,
  payment,
  itemPreview,
  orderSummary,
  title,
  helper,
}: Props) => {
  return (
    <Wrapper>
      <Group>
        <Preview>
          {itemPreview}
          <Text>
            {title}
            {helper}
          </Text>
        </Preview>
      </Group>
      <OrderSummary>{orderSummary}</OrderSummary>
      <SummaryTable {...summaryTableProps} />
      <Group>
        <Title5>
          <FormattedMessage {...paymentMessages.payment} />
        </Title5>
        <SelectedPaymentMethodForConfirmation {...payment} />
      </Group>
      {seller && (
        <Group>
          <Title5>
            <FormattedMessage {...paymentMessages.seller} />
          </Title5>
          {seller}
        </Group>
      )}
    </Wrapper>
  );
};

export default BuyConfirmation;
