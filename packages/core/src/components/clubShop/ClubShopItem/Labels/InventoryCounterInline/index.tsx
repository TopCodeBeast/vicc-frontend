import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14 } from '@core/atoms/typography';

const AmountRoot = styled.span`
  font-weight: var(--t-bolder);
  color: var(--c-neutral-700);
`;

type Props = { amount: number; name: string };
export const InventoryCounterInline = ({ amount, name }: Props) => (
  <Text14 color="var(--c-neutral-500)">
    <FormattedMessage
      id="ClubShop.ItemPreviewDialog.Cta.InventoryText"
      defaultMessage="Inventory: <Amount>{myAvailableTotalPurchasesCount}</Amount> {name}"
      values={{
        Amount: (...chunks: string[]) => <AmountRoot>{chunks}</AmountRoot>,
        myAvailableTotalPurchasesCount: amount,
        name,
      }}
    />
  </Text14>
);
