import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption } from '@core/atoms/typography';

const FlexContainer = styled(Caption)`
  display: inline-flex;
  align-items: center;
  gap: var(--unit);

  color: var(--c-neutral-1000);
  background-color: var(--c-red-600);
  border-radius: 100px;
  padding: 0 var(--unit);
`;

export const SoldOut = () => (
  <FlexContainer bold>
    <FormattedMessage
      id="ClubShop.Item.Label.SoldOut"
      defaultMessage="Sold Out"
    />
  </FlexContainer>
);
