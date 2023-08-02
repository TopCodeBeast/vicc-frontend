import styled from 'styled-components';

import { Text14 } from '@core/atoms/typography';

const Text = styled(Text14)`
  background-color: var(--c-brand-600);
  border-radius: var(--unit);
  padding: 0 var(--unit);
`;

type Props = { amount: number };
export const InventoryCounter = ({ amount }: Props) => (
  <Text bold color="var(--c-neutral-1000)">
    x{amount}
  </Text>
);
