import { faCircleCheck, faClock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, useIntl } from 'react-intl';
import styled, { css } from 'styled-components';

import { Caption, Text14 } from '@sorare/core/src/atoms/typography';
import { useTimeLeft } from '@sorare/core/src/hooks/useTimeLeft';

const flex = css`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;
const Root = styled(Text14)`
  ${flex}
`;
const Label = styled(Caption)`
  ${flex}
`;
const NewRoot = styled(Label)`
  background-color: var(--c-brand-600);
  border-radius: 100px;
  padding: 0 var(--unit);
`;
const LimitReachedRoot = styled(Label)`
  background-color: var(--c-neutral-400);
  border-radius: 100px;
  padding: 0 var(--unit);
`;
const SoldOutRoot = styled(Label)`
  color: var(--c-neutral-1000);
  background-color: var(--c-red-600);
  border-radius: 100px;
  padding: 0 var(--unit);
`;
const FewLeftRoot = styled(Label)`
  color: var(--c-neutral-1000);
  background-color: var(--c-red-800);
  border-radius: 100px;
  padding: 0 var(--unit);
`;
const OldPriceRoot = styled(Text14)`
  text-decoration: line-through;
`;
const InventoryCounterRoot = styled(Text14)`
  background-color: var(--c-brand-600);
  border-radius: var(--unit);
  padding: 0 var(--unit);
`;
const AmountRoot = styled.span`
  font-weight: var(--t-bolder);
  color: var(--c-neutral-700);
`;

export const Owned = () => (
  <Root bold color="var(--c-neutral-800)">
    <FontAwesomeIcon icon={faCircleCheck} />
    <FormattedMessage id="ClubShop.Item.Owned" defaultMessage="Owned" />
  </Root>
);

export const Equipped = () => (
  <Root bold color="var(--c-green-600)">
    <FontAwesomeIcon icon={faCircleCheck} />
    <FormattedMessage id="ClubShop.Item.Equipped" defaultMessage="Equipped" />
  </Root>
);

type OrderConfirmedProps = {
  color?: 'var(--c-green-600)' | 'var(--c-neutral-1000)';
};
export const OrderConfirmed = ({
  color = 'var(--c-green-600)',
}: OrderConfirmedProps) => (
  <Root bold color={color}>
    <FontAwesomeIcon icon={faCircleCheck} />
    <FormattedMessage
      id="ClubShop.Item.OrderConfirmed"
      defaultMessage="Order confirmed"
    />
  </Root>
);

export const New = () => (
  <NewRoot bold color="var(--c-static-neutral-100)">
    <FormattedMessage id="ClubShop.Item.Label.New" defaultMessage="New" />
  </NewRoot>
);

export const LimitReached = () => (
  <LimitReachedRoot bold color="var(--c-neutral-900)">
    <FormattedMessage
      id="ClubShop.Item.Label.LimitReached"
      defaultMessage="Limit reached"
    />
  </LimitReachedRoot>
);
type ResetInProps = { time: Date };
export const ResetIn = ({ time }: ResetInProps) => {
  const { message } = useTimeLeft(time);
  return (
    <Label color="var(--c-neutral-600)">
      <FontAwesomeIcon icon={faClock} />
      <FormattedMessage
        id="ClubShop.Item.Label.Reset"
        defaultMessage="Reset in {remaining}"
        values={{ remaining: message }}
      />
    </Label>
  );
};
export const FewLeft = () => (
  <FewLeftRoot bold>
    <FormattedMessage
      id="ClubShop.Item.Label.FewLeft"
      defaultMessage="Few left"
    />
  </FewLeftRoot>
);
export const SoldOut = () => {
  return (
    <SoldOutRoot bold>
      <FormattedMessage
        id="ClubShop.Item.Label.SoldOut"
        defaultMessage="Sold Out"
      />
    </SoldOutRoot>
  );
};
type InventoryCounterInlineProps = {
  item: {
    myAvailableTotalPurchasesCount: number;
    name: string;
  };
};
export const InventoryCounterInline = ({
  item,
}: InventoryCounterInlineProps) => (
  <Text14 color="var(--c-neutral-500)">
    <FormattedMessage
      id="ClubShop.ItemPreviewDialog.Cta.InventoryText"
      defaultMessage="Inventory: <Amount>{myAvailableTotalPurchasesCount}</Amount> {name}"
      values={{
        Amount: (...chunks: string[]) => <AmountRoot>{chunks}</AmountRoot>,
        myAvailableTotalPurchasesCount: item.myAvailableTotalPurchasesCount,
        name: item.name,
      }}
    />
  </Text14>
);
type ExpirationInProps = { time: Date };
export const Expiration = ({ time }: ExpirationInProps) => {
  const { message } = useTimeLeft(time);
  return (
    <Label color="var(--c-neutral-600)">
      <FontAwesomeIcon icon={faClock} />
      <FormattedMessage
        id="ClubShop.Item.Label.ExpirationTime"
        defaultMessage="Expire in {remaining}"
        values={{ remaining: message }}
      />
    </Label>
  );
};
type OldPriceRoot = {
  value: number;
};
export const OldPrice = ({ value }: OldPriceRoot) => {
  const { formatNumber } = useIntl();
  return (
    <OldPriceRoot color="var(--c-neutral-500)">
      {formatNumber(value)}
    </OldPriceRoot>
  );
};
type InventoryCounterProps = { amount: number };
export const InventoryCounter = ({ amount }: InventoryCounterProps) => (
  <InventoryCounterRoot bold color="var(--c-neutral-1000)">
    x{amount}
  </InventoryCounterRoot>
);
