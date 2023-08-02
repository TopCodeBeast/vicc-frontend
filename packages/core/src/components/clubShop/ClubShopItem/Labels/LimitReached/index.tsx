import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption } from '@core/atoms/typography';

const FlexContainer = styled(Caption)`
  display: inline-flex;
  align-items: center;
  gap: var(--unit);

  color: var(--c-neutral-900);
  background-color: var(--c-neutral-400);
  border-radius: 100px;
  padding: 0 var(--unit);
`;

export const LimitReached = () => (
  <FlexContainer bold>
    <FormattedMessage
      id="ClubShop.Item.Label.LimitReached"
      defaultMessage="Limit reached"
    />
  </FlexContainer>
);
