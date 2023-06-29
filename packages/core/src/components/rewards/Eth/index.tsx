import styled from 'styled-components';

import { Title2 } from '@core/atoms/typography';
import { FormattedWei } from '@core/contexts/intl/FormattedWei';

import ethFrontCardBackground from './assets/ethFrontCardBackground.svg';

const Card = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(var(--half-unit) * 1px);
  border-radius: var(--double-unit);
  background: url(${ethFrontCardBackground});
  background-size: cover;
  padding: var(--unit);
  color: var(--c-neutral-100);
  aspect-ratio: var(--card-aspect-ratio);
`;

type Props = {
  amount: string;
};

export const Eth = ({ amount }: Props) => {
  return (
    <Card>
      <Title2 uppercase>
        <FormattedWei value={amount} context="EthereumReward" />
      </Title2>
    </Card>
  );
};
