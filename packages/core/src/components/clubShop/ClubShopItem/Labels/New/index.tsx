import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Caption } from '@core/atoms/typography';

const FlexContainer = styled(Caption)`
  display: inline-flex;
  align-items: center;
  gap: var(--unit);

  color: var(--c-static-neutral-100);
  background-color: var(--c-brand-600);
  border-radius: 100px;
  padding: 0 var(--unit);
`;

export const New = () => (
  <FlexContainer bold color="var(--c-static-neutral-100)">
    <FormattedMessage id="ClubShop.Item.Label.New" defaultMessage="New" />
  </FlexContainer>
);
