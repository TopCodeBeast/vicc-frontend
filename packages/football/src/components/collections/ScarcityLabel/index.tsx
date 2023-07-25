import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { scarcityMessages } from '@sorare/core/src/lib/scarcity';
import { Color } from '@sorare/core/src/style/types';

const Root = styled.span<{ color: Color }>`
  color: ${({ color }) => color};
  font-weight: var(--t-bold);
`;

type Props = { scarcity: Rarity };

const colorMapping = {
  [Rarity.common]: 'var(--c-collection-common)',
  [Rarity.limited]: 'var(--c-collection-limited)',
  [Rarity.rare]: 'var(--c-collection-rare)',
  [Rarity.super_rare]: 'var(--c-collection-superRare)',
  [Rarity.unique]: 'var(--c-collection-unique)',
  [Rarity.custom_series]: 'var(--c-collection-customSeries)',
} as Record<Rarity, Color>;

export const ScarcityLabel = ({ scarcity }: Props) => {
  const { formatMessage } = useIntl();

  const label = formatMessage(scarcityMessages[scarcity]);

  return <Root color={colorMapping[scarcity]}>{label}</Root>;
};
