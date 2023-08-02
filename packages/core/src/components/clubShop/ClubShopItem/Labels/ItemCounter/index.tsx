import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption } from '@core/atoms/typography';

const Counter = styled(Caption)`
  display: inline-flex;
  align-items: center;
  gap: var(--half-unit);
`;

type Props = {
  count: number;
  limit: number;
};

export const ItemCounter = ({ count, limit }: Props) => (
  <Counter color="var(--c-neutral-1000)">
    <FormattedMessage
      id="ShopItemPicker.Item.Counter"
      defaultMessage="{myPurchasesCount} / {limitPerUser}"
      values={{
        myPurchasesCount: count,
        limitPerUser: limit,
      }}
    />
  </Counter>
);
