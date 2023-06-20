import styled from 'styled-components';

import { Title2 } from '@sorare/core/src/atoms/typography';
import { FormattedWei } from 'contexts/intl/FormattedWei';
import { theme } from '@sorare/core/src/style/theme';

import ethFrontCardBackground from './assets/ethFrontCardBackground.svg';

const Card = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(var(--half-unit) * 1px);
  border-radius: ${theme.radius.md}px;
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
